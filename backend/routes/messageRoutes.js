const express = require('express');
const { getMessages, sendMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getMessages).post(protect, sendMessage);
router.route('/:id').delete(protect, deleteMessage);

module.exports = router;