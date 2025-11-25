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
 * @route   GET /auth/user/:uid
 * @desc    Ottiene un utente per UID
 * @access  Public (TODO: proteggere con auth middleware)
 */
router.get('/user/:uid', (req, res) => authController.getUserByUid(req, res));

/**
 * @route   GET /auth/user/username/:username
 * @desc    Ottiene un utente per username
 * @access  Public (TODO: proteggere con auth middleware)
 */
router.get('/user/username/:username', (req, res) => authController.getUserByUsername(req, res));

/**
 * @route   DELETE /auth/user
 * @desc    Delete a user by email and password
 * @access  Public
 * @body    { email: string, password: string }
 */
router.delete('/user', (req, res) => authController.deleteUser(req, res));

module.exports = router;

