const AuditLog = require('../models/AuditLog');

const logAction = async (userId, action, details = '', ip = '') => {
  try {
    await AuditLog.create({ user: userId, action, details, ip });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};

module.exports = logAction;
