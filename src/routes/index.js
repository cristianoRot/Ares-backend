/**
 * Routes Index
 * Centralizza tutte le routes dell'applicazione
 */

const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');

// Mount routes
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

