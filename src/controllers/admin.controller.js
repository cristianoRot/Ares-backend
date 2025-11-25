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
        success: true,
        message: 'Users retrieved successfully',
        data: {
          total: result.total,
          users: result.users,
          stats: result.stats
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get all users error:', error);
      
      return res.status(500).json({
        success: false,
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
        success: true,
        message: 'Users count retrieved successfully',
        data: {
          count: result.count
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get users count error:', error);
      
      return res.status(500).json({
        success: false,
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
          success: false,
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
        success: true,
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Set admin error:', error);
      
      return res.status(400).json({
        success: false,
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
          success: false,
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
        success: true,
        message: result.message,
        data: result.data,
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
          success: false,
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
        success: true,
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Set user disabled error:', error);
      
      return res.status(400).json({
        success: false,
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
   * Update user properties (displayName, customClaims, profile data)
   * Only accessible by existing admins
   */
  async updateUser(req, res) {
    try {
      const { targetUserEmail, displayName, customClaims, profile } = req.body;

      // Validate input
      if (!targetUserEmail) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_EMAIL',
            message: 'targetUserEmail is required in request body'
          },
          timestamp: new Date().toISOString()
        });
      }

      const results = {};

      // Update display name if provided
      if (displayName !== undefined) {
        const displayNameResult = await adminService.updateUserDisplayName(targetUserEmail, displayName);
        results.displayName = displayNameResult.data;
      }

      // Update custom claims if provided
      if (customClaims !== undefined && typeof customClaims === 'object') {
        const claimsResult = await adminService.updateUserCustomClaims(targetUserEmail, customClaims);
        results.customClaims = claimsResult.data;
      }

      // Update profile data if provided (coins, xp, kills, etc.)
      if (profile !== undefined && typeof profile === 'object') {
        const profileResult = await adminService.updateUserProfile(targetUserEmail, profile);
        results.profile = profileResult.data;
      }

      // If nothing was updated
      if (Object.keys(results).length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'At least one field (displayName, customClaims, or profile) must be provided'
          },
          timestamp: new Date().toISOString()
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update user error:', error);
      
      return res.status(400).json({
        success: false,
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An error occurred while updating the user'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new AdminController();

