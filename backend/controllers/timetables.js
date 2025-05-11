const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const TimeSlot = require('../models/TimeSlot');

// @desc    Get all timetable entries
// @route   GET /api/timetables
// @access  Private
exports.getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate({
        path: 'class',
        select: 'name section'
      })
      .populate('timeSlot')
      .populate('subject')
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get timetable entries by class
// @route   GET /api/timetables/class/:classId
// @access  Private
exports.getTimetableByClass = async (req, res) => {
  try {
    const timetables = await Timetable.find({ class: req.params.classId })
      .populate({
        path: 'class',
        select: 'name section'
      })
      .populate('timeSlot')
      .populate('subject')
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get timetable entries by teacher
// @route   GET /api/timetables/teacher/:teacherId
// @access  Private
exports.getTimetableByTeacher = async (req, res) => {
  try {
    const timetables = await Timetable.find({ teacher: req.params.teacherId })
      .populate({
        path: 'class',
        select: 'name section'
      })
      .populate('timeSlot')
      .populate('subject')
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new timetable entry
// @route   POST /api/timetables
// @access  Private/Admin
exports.createTimetable = async (req, res) => {
  try {
    const { class: classId, day, timeSlot: timeSlotId, subject: subjectId, teacher: teacherId, isBreak, room } = req.body;

    // Check for conflicts - teacher already assigned to another class at the same time
    if (!isBreak && teacherId) {
      const conflict = await Timetable.findOne({
        teacher: teacherId,
        day,
        timeSlot: timeSlotId,
        _id: { $ne: req.params.id }
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          error: 'Teacher is already assigned to another class at this time'
        });
      }
    }

    const timetable = await Timetable.create(req.body);

    res.status(201).json({
      success: true,
      data: timetable
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update timetable entry
// @route   PUT /api/timetables/:id
// @access  Private/Admin
exports.updateTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        error: 'Timetable entry not found'
      });
    }

    // Check for conflicts - teacher already assigned to another class at the same time
    if (!req.body.isBreak && req.body.teacher) {
      const conflict = await Timetable.findOne({
        teacher: req.body.teacher,
        day: req.body.day || timetable.day,
        timeSlot: req.body.timeSlot || timetable.timeSlot,
        _id: { $ne: req.params.id }
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          error: 'Teacher is already assigned to another class at this time'
        });
      }
    }

    timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete timetable entry
// @route   DELETE /api/timetables/:id
// @access  Private/Admin
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        error: 'Timetable entry not found'
      });
    }

    await timetable.deleteOne();

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
