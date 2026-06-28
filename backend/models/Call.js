const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactName: { type: String, default: 'Unknown' },
  number: { type: String, required: true },
  type: { type: String, enum: ['outgoing', 'incoming', 'missed'], default: 'outgoing' },
  status: { type: String, enum: ['Connected', 'Voicemail', 'No Answer', 'Calling'], default: 'Calling' },
  duration: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Call', callSchema);