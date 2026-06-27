const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    direction: {
      type: String,
      enum: ['sent', 'received'],
      default: 'sent',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);