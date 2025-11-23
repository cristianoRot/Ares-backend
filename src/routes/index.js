/**
 * Routes Index
 * Centralizes all application routes
 */

const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

