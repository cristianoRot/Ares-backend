const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db } = require('./config/firebase');

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
    endpoints: {
      basic: [
        'GET /name - Ottieni il nome',
        'GET /status - Stato del server',
        'POST /data - Invia dati'
      ],
      firebase: [
        'GET /collection/:collectionName - Ottieni tutti i documenti',
        'GET /collection/:collectionName/:docId - Ottieni un documento',
        'POST /collection/:collectionName - Crea un nuovo documento',
        'PUT /collection/:collectionName/:docId - Aggiorna un documento',
        'DELETE /collection/:collectionName/:docId - Elimina un documento'
      ]
    },
    firebaseStatus: db ? 'connected' : 'not configured'
  });
});

// API: Ottieni il nome
app.get('/name', (req, res) => {
  res.json({
    name: 'Ares'
  });
});

// API: Verifica lo stato del server
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API: Ricevi dati (esempio senza DB)
app.post('/data', (req, res) => {
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

// ========== FIREBASE/FIRESTORE ENDPOINTS ==========

// GET: Ottieni tutti i documenti da una collection
app.get('/collection/:collectionName', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database non disponibile' });
    }

    const { collectionName } = req.params;
    const snapshot = await db.collection(collectionName).get();
    
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Errore nel recupero dei documenti:', error);
    res.status(500).json({ 
      error: 'Errore nel recupero dei dati',
      message: error.message 
    });
  }
});

// GET: Ottieni un singolo documento
app.get('/collection/:collectionName/:docId', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database non disponibile' });
    }

    const { collectionName, docId } = req.params;
    const doc = await db.collection(collectionName).doc(docId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Documento non trovato' });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero del documento:', error);
    res.status(500).json({ 
      error: 'Errore nel recupero del documento',
      message: error.message 
    });
  }
});

// POST: Crea un nuovo documento
app.post('/collection/:collectionName', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database non disponibile' });
    }

    const { collectionName } = req.params;
    const data = req.body;

    // Aggiungi timestamp
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();

    const docRef = await db.collection(collectionName).add(data);

    res.status(201).json({
      success: true,
      message: 'Documento creato con successo',
      id: docRef.id,
      data: data
    });
  } catch (error) {
    console.error('Errore nella creazione del documento:', error);
    res.status(500).json({ 
      error: 'Errore nella creazione del documento',
      message: error.message 
    });
  }
});

// PUT: Aggiorna un documento esistente
app.put('/collection/:collectionName/:docId', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database non disponibile' });
    }

    const { collectionName, docId } = req.params;
    const data = req.body;

    // Aggiungi timestamp di aggiornamento
    data.updatedAt = new Date().toISOString();

    await db.collection(collectionName).doc(docId).update(data);

    res.json({
      success: true,
      message: 'Documento aggiornato con successo',
      id: docId
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del documento:', error);
    res.status(500).json({ 
      error: 'Errore nell\'aggiornamento del documento',
      message: error.message 
    });
  }
});

// DELETE: Elimina un documento
app.delete('/collection/:collectionName/:docId', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database non disponibile' });
    }

    const { collectionName, docId } = req.params;
    await db.collection(collectionName).doc(docId).delete();

    res.json({
      success: true,
      message: 'Documento eliminato con successo',
      id: docId
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione del documento:', error);
    res.status(500).json({ 
      error: 'Errore nell\'eliminazione del documento',
      message: error.message 
    });
  }
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

