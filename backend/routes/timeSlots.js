const express = require('express');
const {
  getTimeSlots,
  getTimeSlot,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
} = require('../controllers/timeSlots');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getTimeSlots)
  .post(protect, authorize('admin'), createTimeSlot);

router
  .route('/:id')
  .get(protect, getTimeSlot)
  .put(protect, authorize('admin'), updateTimeSlot)
  .delete(protect, authorize('admin'), deleteTimeSlot);

module.exports = router;
