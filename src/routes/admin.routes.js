/**
 * Admin Routes
 * Defines all routes for admin operations
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middlewares/adminAuth');

/**
 * @route   GET /admin/users
 * @desc    Get all users with their profiles
 * @access  Admin only (requires Firebase ID token with admin claim)
 */
router.get('/users', adminAuth, (req, res) => adminController.getAllUsers(req, res));

/**
 * @route   GET /admin/users/count
 * @desc    Get total users count
 * @access  Admin only (requires Firebase ID token with admin claim)
 */
router.get('/users/count', adminAuth, (req, res) => adminController.getUsersCount(req, res));

module.exports = router;

