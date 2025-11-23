/**
 * Admin Routes
 * Defines all routes for admin operations
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

/**
 * @route   GET /admin/users
 * @desc    Get all users with their profiles
 * @access  Public (TODO: protect with admin authentication middleware)
 */
router.get('/users', (req, res) => adminController.getAllUsers(req, res));

/**
 * @route   GET /admin/users/count
 * @desc    Get total users count
 * @access  Public (TODO: protect with admin authentication middleware)
 */
router.get('/users/count', (req, res) => adminController.getUsersCount(req, res));

module.exports = router;

