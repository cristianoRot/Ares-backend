const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint di benvenuto
app.get('/', (req, res) => {
  const baseUrl = process.env.BASE_URL || req.protocol + '://' + req.get('host');
  res.json({
    message: 'Benvenuto all\'API di Ares',
    version: '1.0.0',
    baseUrl: baseUrl,
    endpoints: [
      'GET /api/name - Ottieni il nome',
      'GET /api/status - Stato del server',
      'POST /api/data - Invia dati'
    ]
  });
});

// API: Ottieni il nome
app.get('/api/name', (req, res) => {
  res.json({
    name: 'Ares'
  });
});

// API: Verifica lo stato del server
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API: Ricevi dati
app.post('/api/data', (req, res) => {
  const { name, message } = req.body;
  
  if (!name || !message) {
    return res.status(400).json({
      error: 'Campi mancanti',
      required: ['name', 'message']
    });
  }
  
  res.json({
    success: true,
    received: {
      name,
      message,
      receivedAt: new Date().toISOString()
    }
  });
});

// Gestione errori 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint non trovato',
    path: req.path
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

