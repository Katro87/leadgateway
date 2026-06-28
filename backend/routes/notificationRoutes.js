const express = require('express');
const { getNotifications, markAsRead, markOneAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAsRead);
router.put('/:id/read', protect, markOneAsRead);

module.exports = router;