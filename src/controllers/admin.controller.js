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
}

module.exports = new AdminController();

