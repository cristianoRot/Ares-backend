/**
 * Admin Authentication Middleware
 * Verifies email/password and checks admin privileges
 */

const { admin } = require('../../config/firebase');
const axios = require('axios');

const adminAuth = async (req, res, next) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Email and password are required in request body'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify credentials using Firebase Auth REST API
    let userRecord;
    try {
      // First, get user by email to verify it exists
      userRecord = await admin.auth().getUserByEmail(email.trim());
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify password using Firebase REST API if Web API Key is available
    if (process.env.FIREBASE_WEB_API_KEY) {
      try {
        // Use Firebase REST API to verify password
        await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
          {
            email: email.trim(),
            password: password,
            returnSecureToken: true
          }
        );
        // If we get here, credentials are valid
      } catch (error) {
        // Password verification failed
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          },
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // If Web API Key is not available, only verify user exists
      // Note: This is less secure. For production, add FIREBASE_WEB_API_KEY to environment variables
      console.warn('[AdminAuth] FIREBASE_WEB_API_KEY not set. Password verification skipped.');
    }

    // Check if user has admin custom claim
    const customClaims = userRecord.customClaims || {};
    
    if (!customClaims.admin && customClaims.admin !== true) {
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
      uid: userRecord.uid,
      email: userRecord.email,
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
