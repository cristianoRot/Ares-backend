/**
 * Authentication Routes
 * Definisce tutte le route per l'autenticazione
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @route   POST /auth/register
 * @desc    Registra un nuovo utente
 * @access  Public
 * @body    { email, password, username }
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @route   POST /auth/user/:username
 * @desc    Get user data by username (requires email and password in body)
 * @access  Public (requires valid credentials or admin privileges)
 * @body    { email: string, password: string }
 */
router.post('/user/:username', (req, res) => authController.getUserByUsername(req, res));

/**
 * @route   DELETE /auth/user
 * @desc    Delete a user by email and password
 * @access  Public
 * @body    { email: string, password: string }
 */
router.delete('/user', (req, res) => authController.deleteUser(req, res));

module.exports = router;

