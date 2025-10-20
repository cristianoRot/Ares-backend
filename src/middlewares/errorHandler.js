/**
 * Global Error Handler Middleware
 * Gestisce tutti gli errori dell'applicazione
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Errore di validazione
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Errore di validazione',
      details: err.message
    });
  }

  // Errore Firebase
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(400).json({
      success: false,
      error: err.message,
      code: err.code
    });
  }

  // Errore generico del server
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Errore interno del server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

