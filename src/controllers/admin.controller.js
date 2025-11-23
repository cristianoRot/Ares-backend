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
}

module.exports = new AdminController();

