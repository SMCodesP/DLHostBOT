const mongoose = require('mongoose');

const TicketsSchema = new mongoose.Schema({
  name_channel: String,
  user_id: String,
  channel_id: String,
  date: {
    year: Number,
    month: Number,
    day: Number,
  },
});

module.exports = mongoose.model('Tickets', TicketsSchema);
