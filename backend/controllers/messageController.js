const Message = require('../models/Message');

const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .populate('recipient', 'name phone')
      .sort({ createdAt: -1 });

    const conversations = [];
    const seen = new Set();

    for (const msg of messages) {
      const recipientId = msg.recipient._id.toString();
      if (!seen.has(recipientId)) {
        seen.add(recipientId);
        conversations.push({
          _id: recipientId,
          name: msg.recipient.name,
          phone: msg.recipient.phone,
          lastMessage: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: 0,
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      sender: req.user.id,
      recipient: req.params.contactId,
    }).sort({ createdAt: 1 });

    res.json(messages.map(m => ({
      _id: m._id,
      text: m.text,
      direction: m.direction,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;
    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      text,
      direction: 'sent',
    });

    res.status(201).json({
      _id: message._id,
      text: message.text,
      direction: message.direction,
      time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage };