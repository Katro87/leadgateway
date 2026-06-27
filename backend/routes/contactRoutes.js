const express = require('express');
const { getContacts, getContact, createContact, updateContact, deleteContact, toggleFavorite } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getContacts)
  .post(protect, createContact);

router.route('/:id')
  .get(protect, getContact)
  .put(protect, updateContact)
  .delete(protect, deleteContact);

router.route('/:id/favorite')
  .put(protect, toggleFavorite);

module.exports = router;