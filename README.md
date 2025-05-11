# Schedule Master

A comprehensive timetable management system built with the MERN stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS.

## Features

- **User Roles**: Admin, Teacher, and Student roles with different permissions and views
- **Automated Timetable Generation**: Algorithm to create conflict-free schedules
- **Class Management**: Create and manage classes and assign subjects
- **Subject Management**: Create and manage subjects
- **Teacher Management**: Assign teachers to subjects and set maximum teaching hours
- **Time Slot Management**: Define class periods and breaks
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/schedule-master.git
   cd schedule-master
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/schedule-master
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Admin

1. Register a new account with the role "admin"
2. Log in with your admin credentials
3. Use the admin dashboard to:
   - Manage classes
   - Manage subjects
   - Manage teachers
   - Manage time slots
   - Generate timetables

### Teacher

1. Register a new account with the role "teacher"
2. Log in with your teacher credentials
3. View your teaching schedule

### Student

1. Register a new account with the role "student"
2. Log in with your student credentials
3. View class timetables

## Project Structure

```
schedule-master/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main component
│   │   └── main.jsx     # Entry point
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
└── README.md            # Project documentation
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
