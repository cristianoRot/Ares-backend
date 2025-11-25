/**
 * Authentication Controller
 * Gestisce le richieste HTTP per l'autenticazione
 */

const authService = require('../services/auth.service');
const UserModel = require('../models/User.model');

class AuthController {
  /**
   * POST /auth/register
   * Register a new user
   */
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      // Input validation
      const validation = UserModel.validate({ email, password, username });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validation.errors
          },
          timestamp: new Date().toISOString()
        });
      }

      // Register the user
      const result = await authService.register(email, password, username);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.username,
          profile: result.user.profile.toFirestore()
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('User registration error:', error);
      
      return res.status(400).json({
        success: false,
        error: {
          code: error.code || 'AUTH_ERROR',
          message: error.message || 'An error occurred during registration'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /auth/user/:uid
   * Get user data by UID
   */
  async getUserByUid(req, res) {
    try {
      const { uid } = req.params;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_UID',
            message: 'User UID is required'
          },
          timestamp: new Date().toISOString()
        });
      }

      const user = await authService.getUserByUid(uid);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      return res.status(200).json({
        success: true,
        data: user.toFirestore(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get user error:', error);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while retrieving user data'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /auth/user/username/:username
   * Get user data by username
   */
  async getUserByUsername(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_USERNAME',
            message: 'Username is required'
          },
          timestamp: new Date().toISOString()
        });
      }

      const user = await authService.getUserByUsername(username);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      return res.status(200).json({
        success: true,
        data: user.toFirestore(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get user error:', error);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while retrieving user data'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * DELETE /auth/user
   * Delete a user by email and password
   */
  async deleteUser(req, res) {
    try {
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

      // Verify credentials and delete user
      const result = await authService.deleteUserByCredentials(email, password);

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Delete user error:', error);
      
      return res.status(400).json({
        success: false,
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while deleting the user'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new AuthController();

