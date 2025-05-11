const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: function() {
      return !this.isBreak;
    }
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: function() {
      return !this.isBreak;
    }
  },
  isBreak: {
    type: Boolean,
    default: false
  },
  room: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate entries for the same class, day, and time slot
TimetableSchema.index({ class: 1, day: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
