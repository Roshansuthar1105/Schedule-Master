const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: [true, 'Please add a start time'],
    trim: true
  },
  endTime: {
    type: String,
    required: [true, 'Please add an end time'],
    trim: true
  },
  isBreak: {
    type: Boolean,
    default: false
  },
  breakName: {
    type: String,
    required: false,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
