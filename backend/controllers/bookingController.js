const UserBooking = require('../models/Booking');

exports.orderProduct = async (req, res) => {
  try {
    const booking = new UserBooking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booked successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

exports.getBookingsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookings = await UserBooking.find({ userId }).populate('productId').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await UserBooking.find().populate('productId').populate('userId').sort('-createdAt');
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await UserBooking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
