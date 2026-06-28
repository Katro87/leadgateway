const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactName: { type: String, default: 'Unknown' },
  number: { type: String, required: true },
  text: { type: String, required: true },
  direction: { type: String, enum: ['sent', 'received'], default: 'sent' },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);