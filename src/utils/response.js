/**
 * Response Utilities
 * Provides helpers for creating standardized HTTP responses
 */

class ResponseUtil {
  /**
   * Success response
   */
  static success(res, data, message = 'Operation completed successfully', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Error response
   */
  static error(res, message, statusCode = 500, errorCode = null) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode || 'ERROR',
        message: message
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Validation error response
   */
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Not found response
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: message
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unauthorized response
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: message
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Forbidden response
   */
  static forbidden(res, message = 'Access denied') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: message
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ResponseUtil;
