const express = require('express');
const {
  getTimetables,
  getTimetableByClass,
  getTimetableByTeacher,
  createTimetable,
  updateTimetable,
  deleteTimetable
} = require('../controllers/timetables');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getTimetables)
  .post(protect, authorize('admin'), createTimetable);

router
  .route('/class/:classId')
  .get(protect, getTimetableByClass);

router
  .route('/teacher/:teacherId')
  .get(protect, getTimetableByTeacher);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateTimetable)
  .delete(protect, authorize('admin'), deleteTimetable);

module.exports = router;
