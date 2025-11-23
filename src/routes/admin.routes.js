/**
 * Admin Routes
 * Defines all routes for admin operations
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middlewares/adminAuth');

/**
 * @route   POST /admin/users
 * @desc    Get all users with their profiles
 * @access  Admin only (requires email and password in body)
 * @body    { email: string, password: string }
 */
router.post('/users', adminAuth, (req, res) => adminController.getAllUsers(req, res));

/**
 * @route   POST /admin/users/count
 * @desc    Get total users count
 * @access  Admin only (requires email and password in body)
 * @body    { email: string, password: string }
 */
router.post('/users/count', adminAuth, (req, res) => adminController.getUsersCount(req, res));

module.exports = router;
