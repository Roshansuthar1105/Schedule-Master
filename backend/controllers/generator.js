const { generateTimetable } = require('../utils/timetableGenerator');

// @desc    Generate timetable
// @route   POST /api/generator/generate
// @access  Private/Admin
exports.generateNewTimetable = async (req, res) => {
  try {
    const result = await generateTimetable();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      count: result.count
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
