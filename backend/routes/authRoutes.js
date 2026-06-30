const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

const client = new OAuth2Client('232273623767-rghiq4roq6d5sncuhn3ormobupdr3him.apps.googleusercontent.com');

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '232273623767-rghiq4roq6d5sncuhn3ormobupdr3him.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: 'google-oauth-' + Date.now(), avatar: picture || '' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: picture || '', token });
  } catch (error) {
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;