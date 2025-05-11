const TimeSlot = require('../models/TimeSlot');

// @desc    Get all time slots
// @route   GET /api/timeslots
// @access  Private
exports.getTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find().sort('order');

    res.status(200).json({
      success: true,
      count: timeSlots.length,
      data: timeSlots
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single time slot
// @route   GET /api/timeslots/:id
// @access  Private
exports.getTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found'
      });
    }

    res.status(200).json({
      success: true,
      data: timeSlot
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new time slot
// @route   POST /api/timeslots
// @access  Private/Admin
exports.createTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.create(req.body);

    res.status(201).json({
      success: true,
      data: timeSlot
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update time slot
// @route   PUT /api/timeslots/:id
// @access  Private/Admin
exports.updateTimeSlot = async (req, res) => {
  try {
    let timeSlot = await TimeSlot.findById(req.params.id);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found'
      });
    }

    timeSlot = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: timeSlot
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete time slot
// @route   DELETE /api/timeslots/:id
// @access  Private/Admin
exports.deleteTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found'
      });
    }

    await timeSlot.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
