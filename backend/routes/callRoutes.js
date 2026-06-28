const express = require('express');
const { getCalls, createCall, deleteCall } = require('../controllers/callController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getCalls).post(protect, createCall);
router.route('/:id').delete(protect, deleteCall);

module.exports = router;