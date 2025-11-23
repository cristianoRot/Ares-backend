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
 * @route   POST /admin/users
 * @desc    Get all users with their profiles
 * @access  Admin only (requires email and password)
 * @query   GET: ?email=admin@example.com&password=adminpass
 * @body    POST: { email: string, password: string }
 */
router.get('/users', adminAuth, (req, res) => adminController.getAllUsers(req, res));
router.post('/users', adminAuth, (req, res) => adminController.getAllUsers(req, res));

/**
 * @route   GET /admin/users/count
 * @route   POST /admin/users/count
 * @desc    Get total users count
 * @access  Admin only (requires email and password)
 * @query   GET: ?email=admin@example.com&password=adminpass
 * @body    POST: { email: string, password: string }
 */
router.get('/users/count', adminAuth, (req, res) => adminController.getUsersCount(req, res));
router.post('/users/count', adminAuth, (req, res) => adminController.getUsersCount(req, res));

module.exports = router;
