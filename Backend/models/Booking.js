const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  artist: { type: String, required: true },
  email: { type: String, required: true },
  seatType: { type: String, enum: ['standard', 'vip'], required: true },
  ticketCount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['gpay', 'phonepe'], required: true },
  bookingDate: { type: Date, default: Date.now },

  // ✅ Extra Info for Ticket
  venueName: { type: String, required: true },
  artistImage: { type: String, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
