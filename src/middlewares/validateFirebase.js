/**
 * Firebase Validation Middleware
 * Verifies that Firebase is properly configured
 */

const { db } = require('../../config/firebase');

const validateFirebase = (req, res, next) => {
  if (!db) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database is not available. Firebase is not configured properly.'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

module.exports = validateFirebase;
