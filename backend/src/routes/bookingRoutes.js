const express = require('express');
const router = express.Router();
const { protect, partner } = require('../middleware/authMiddleware');
const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus
} = require('../controllers/bookingController');

// Protected routes
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/provider', protect, partner, getProviderBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBookingStatus);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
