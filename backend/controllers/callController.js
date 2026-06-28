const Call = require('../models/Call');

const getCalls = async (req, res) => {
  try {
    const calls = await Call.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCall = async (req, res) => {
  try {
    const { number, contactName, type, status, duration } = req.body;
    const call = await Call.create({
      user: req.user.id,
      number,
      contactName: contactName || 'Unknown',
      type: type || 'outgoing',
      status: status || 'Calling',
      duration: duration || 0,
    });
    res.status(201).json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCall = async (req, res) => {
  try {
    await Call.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Call deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCalls, createCall, deleteCall };