/**
 * Admin Controller
 * Handles HTTP requests for admin operations
 */

const adminService = require('../services/admin.service');

class AdminController {
  /**
   * GET /admin/users
   * Get all users with their profiles
   */
  async getAllUsers(req, res) {
    try {
      const result = await adminService.getAllUsers();

      return res.status(200).json({
        total: result.total,
        users: result.users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      
      return res.status(500).json({
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while retrieving users'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /admin/users/count
   * Get total users count
   */
  async getUsersCount(req, res) {
    try {
      const result = await adminService.getUsersCount();

      return res.status(200).json({
        message: 'Users count retrieved successfully',
        data: {
          count: result.count
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get users count error:', error);
      
      return res.status(500).json({
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while counting users'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /admin/set-admin
   * Set or remove admin privileges for a user
   * Only accessible by existing admins
   */
  async setAdmin(req, res) {
    try {
      const { targetUserEmail, isAdmin } = req.body;

      // Validate input
      if (!targetUserEmail) {
        return res.status(400).json({
          error: {
            code: 'MISSING_EMAIL',
            message: 'targetUserEmail is required in request body'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Validate isAdmin (should be boolean)
      const adminValue = typeof isAdmin === 'boolean' ? isAdmin : isAdmin === 'true' || isAdmin === true;

      // Set admin claim
      const result = await adminService.setAdminClaimByEmail(targetUserEmail, adminValue);

      return res.status(200).json({
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Set admin error:', error);
      
      return res.status(400).json({
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while setting admin privileges'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * DELETE /admin/user
   * Delete a user by email
   * Only accessible by existing admins
   */
  async deleteUser(req, res) {
    try {
      const { targetUserEmail } = req.body;

      // Validate input
      if (!targetUserEmail) {
        return res.status(400).json({
          error: {
            code: 'MISSING_EMAIL',
            message: 'targetUserEmail is required in request body'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Delete user
      const result = await adminService.deleteUserByEmail(targetUserEmail);

      return res.status(200).json({
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Delete user error:', error);
      
      return res.status(400).json({
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while deleting the user'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /admin/user/disable
   * Disable or enable a user by email
   * Only accessible by existing admins
   */
  async setUserDisabled(req, res) {
    try {
      const { targetUserEmail, disabled } = req.body;

      // Validate input
      if (!targetUserEmail) {
        return res.status(400).json({
          error: {
            code: 'MISSING_EMAIL',
            message: 'targetUserEmail is required in request body'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Validate disabled (should be boolean)
      const disabledValue = typeof disabled === 'boolean' ? disabled : disabled === 'true' || disabled === true;

      // Update user disabled status
      const result = await adminService.setUserDisabled(targetUserEmail, disabledValue);

      return res.status(200).json({
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Set user disabled error:', error);
      
      return res.status(400).json({
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while updating user status'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /admin/user/update
   * Update user profile data in Firestore only (coins, xp, kills, etc.)
   * Only accessible by existing admins
   * Accepts profile fields directly in the body (not nested in profile object)
   */
  async updateUser(req, res) {
    try {
      const { targetUserEmail, email, password, ...profileFields } = req.body;

      // Validate input
      if (!targetUserEmail) {
        return res.status(400).json({
          error: {
            code: 'MISSING_EMAIL',
            message: 'targetUserEmail is required in request body'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Define allowed profile fields
      const allowedFields = ['coins', 'xp', 'kills', 'deaths', 'matches', 'skinTag', 'friends', 'guns', 'friendRequests'];
      
      // Filter only allowed fields that are provided
      const profileData = {};
      let hasValidField = false;
      
      for (const field of allowedFields) {
        if (profileFields[field] !== undefined) {
          profileData[field] = profileFields[field];
          hasValidField = true;
        }
      }

      // Validate that at least one profile field is provided
      if (!hasValidField) {
        return res.status(400).json({
          error: {
            code: 'MISSING_FIELDS',
            message: `At least one profile field must be provided. Allowed fields: ${allowedFields.join(', ')}`
          },
          timestamp: new Date().toISOString()
        });
      }

      // Update profile data (coins, xp, kills, etc.)
      const profileResult = await adminService.updateUserProfile(targetUserEmail, profileData);

      return res.status(200).json({
        message: 'User profile updated successfully',
        data: profileResult.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update user error:', error);
      
      return res.status(400).json({
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while updating the user profile'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new AdminController();

