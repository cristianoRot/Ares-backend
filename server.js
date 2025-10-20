/**
 * Ares Backend API
 * Server principale dell'applicazione
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configuration
const { db } = require('./config/firebase');

// Import middlewares
const requestLogger = require('./src/middlewares/requestLogger');
const errorHandler = require('./src/middlewares/errorHandler');
const validateFirebase = require('./src/middlewares/validateFirebase');

// Import routes
const apiRoutes = require('./src/routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE SETUP ==========

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// ========== ROUTES ==========

// Welcome endpoint
app.get('/', (req, res) => {
  const baseUrl = process.env.BASE_URL || req.protocol + '://' + req.get('host');
  res.json({
    success: true,
    message: 'Welcome to Ares API',
    version: '2.0.0',
    baseUrl: baseUrl,
    status: 'online',
    endpoints: {
      health: 'GET /health',
      auth: {
        register: 'POST /auth/register',
        getUser: 'GET /auth/user/:uid',
        getUserByUsername: 'GET /auth/user/username/:username',
        deleteUser: 'DELETE /auth/user/:uid'
      },
      legacy: {
        status: 'GET /status',
        name: 'GET /name'
      }
    },
    firebase: {
      status: db ? 'connected' : 'not_configured',
      connected: db ? true : false
    },
    timestamp: new Date().toISOString()
  });
});

// Legacy endpoints (mantenuti per compatibilità)
app.get('/name', (req, res) => {
  res.json({
    success: true,
    name: 'Ares'
  });
});

app.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount API routes direttamente sulla root con validazione Firebase
app.use('/', validateFirebase, apiRoutes);

// ========== ERROR HANDLING ==========

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: 'The requested endpoint does not exist',
      path: req.path
    },
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// ========== SERVER START ==========

app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('🚀 Ares Backend API');
  console.log('========================================');
  console.log(`📡 Server:        http://localhost:${PORT}`);
  console.log(`🌍 Environment:   ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔥 Firebase:      ${db ? '✅ Connected' : '❌ Not configured'}`);
  console.log(`⏰ Started at:    ${new Date().toISOString()}`);
  console.log('========================================');
  console.log('');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  process.exit(0);
});
