const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import route files
const auth = require('./routes/auth');
const classes = require('./routes/classes');
const subjects = require('./routes/subjects');
const teachers = require('./routes/teachers');
const timeSlots = require('./routes/timeSlots');
const timetables = require('./routes/timetables');
const generator = require('./routes/generator');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/schedule-master');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Mount routers
app.use('/api/auth', auth);
app.use('/api/classes', classes);
app.use('/api/subjects', subjects);
app.use('/api/teachers', teachers);
app.use('/api/timeslots', timeSlots);
app.use('/api/timetables', timetables);
app.use('/api/generator', generator);

// Base route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Schedule Master API' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
