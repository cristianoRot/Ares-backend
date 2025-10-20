/**
 * Global Error Handler Middleware
 * Handles all application errors
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }

  // Firebase error
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(400).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      },
      timestamp: new Date().toISOString()
    });
  }

  // Generic server error
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error'
    },
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
