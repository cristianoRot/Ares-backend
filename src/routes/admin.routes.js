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

/**
 * @route   POST /admin/set-admin
 * @desc    Set or remove admin privileges for a user
 * @access  Admin only (requires email and password in body)
 * @body    { email: string, password: string, targetUserEmail: string, isAdmin: boolean }
 */
router.post('/set-admin', adminAuth, (req, res) => adminController.setAdmin(req, res));

/**
 * @route   DELETE /admin/user
 * @desc    Delete a user by email
 * @access  Admin only (requires email and password in body)
 * @body    { email: string, password: string, targetUserEmail: string }
 */
router.delete('/user', adminAuth, (req, res) => adminController.deleteUser(req, res));

/**
 * @route   POST /admin/user/disable
 * @desc    Disable or enable a user by email
 * @access  Admin only (requires email and password in body)
 * @body    { email: string, password: string, targetUserEmail: string, disabled: boolean }
 */
router.post('/user/disable', adminAuth, (req, res) => adminController.setUserDisabled(req, res));

/**
 * @route   POST /admin/user/update
 * @desc    Update user properties (displayName, customClaims)
 * @access  Admin only (requires email and password in body)
 * @body    { email: string, password: string, targetUserEmail: string, displayName?: string, customClaims?: object }
 */
router.post('/user/update', adminAuth, (req, res) => adminController.updateUser(req, res));

module.exports = router;
