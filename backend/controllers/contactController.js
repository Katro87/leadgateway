const Contact = require('../models/Contact');

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user.id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, company, email, phone, tags, notes } = req.body;
    const contact = await Contact.create({
      user: req.user.id,
      name,
      company,
      email,
      phone,
      tags,
      notes,
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user.id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    contact.favorite = !contact.favorite;
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact, toggleFavorite };