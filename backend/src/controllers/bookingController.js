const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, timeSlot, specialRequirements } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      bookingDate,
      timeSlot,
      price: service.price,
      specialRequirements
    });

    const populatedBooking = await booking.populate([
      { path: 'service', select: 'name category imageUrl' },
      { path: 'user', select: 'name mobile' }
    ]);

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service', 'name category imageUrl')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get provider bookings
// @route   GET /api/bookings/provider
// @access  Private/Partner
const getProviderBookings = async (req, res) => {
  try {
    // Find all services provided by the user
    const services = await Service.find({ provider: req.user._id });
    const serviceIds = services.map(service => service._id);

    // Find all bookings for these services
    const bookings = await Booking.find({ service: { $in: serviceIds } })
      .populate('service', 'name category imageUrl')
      .populate('user', 'name mobile')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name category imageUrl price')
      .populate('user', 'name mobile');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    if (status === 'cancelled' && cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = paymentStatus;
    booking.paymentId = paymentId;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus
};
