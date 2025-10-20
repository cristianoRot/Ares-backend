/**
 * Firebase Validation Middleware
 * Verifica che Firebase sia configurato correttamente
 */

const { db } = require('../../config/firebase');

const validateFirebase = (req, res, next) => {
  if (!db) {
    return res.status(503).json({
      success: false,
      error: 'Database non disponibile',
      message: 'Firebase non è configurato correttamente. Verifica le variabili d\'ambiente.'
    });
  }
  
  next();
};

module.exports = validateFirebase;

