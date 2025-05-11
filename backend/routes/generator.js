const express = require('express');
const { generateNewTimetable } = require('../controllers/generator');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/generate', protect, authorize('admin'), generateNewTimetable);

module.exports = router;
