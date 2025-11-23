/**
 * Admin Authentication Middleware
 * Verifies that the user is authenticated and has admin privileges
 */

const { admin } = require('../../config/firebase');

const adminAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization token required. Format: Bearer <token>'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid authorization token format'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired authentication token'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Check if user has admin custom claim
    if (!decodedToken.admin && decodedToken.admin !== true) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin privileges required to access this endpoint'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      admin: true
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during authentication'
      },
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = adminAuth;

