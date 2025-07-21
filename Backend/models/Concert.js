const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  name: String,
  image: String,
  route: String,
  venue: String,
  venueMap: String,
  rules: String,
  eventDetails: {
    language: String,
    duration: String,
    entry: String,
    layout: String,
    seating: String,
    kidFriendly: String,
  },
});

module.exports = mongoose.model('Concert', concertSchema);
