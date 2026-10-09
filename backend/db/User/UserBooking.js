const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phno: String,
  quantity: String,
  totalamount: String,
  productName: String,
  imgUrl: { type: String, required: true },
  category: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  OrderdDate: {
    type: String,
    default: () => new Date().toLocaleDateString('hi-IN'),
  },
});

module.exports = mongoose.model('UserBookingLegacy', bookingSchema, 'bookings');
