const admin = require('firebase-admin');

// Inizializza Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Controlla se Firebase è già inizializzato
    if (admin.apps.length === 0) {
      // Opzione 1: Usa le variabili d'ambiente (consigliato per produzione)
      if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          })
        });
        console.log('✅ Firebase inizializzato con variabili d\'ambiente');
      } 
      // Opzione 2: Usa il file serviceAccountKey.json (per sviluppo locale)
      else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase inizializzato con service account file');
      } else {
        console.warn('⚠️  Firebase non configurato - aggiungi le credenziali nelle variabili d\'ambiente');
      }
    }

    return admin;
  } catch (error) {
    console.error('❌ Errore nell\'inizializzazione di Firebase:', error.message);
    return null;
  }
};

// Inizializza Firebase
const firebaseAdmin = initializeFirebase();

// Ottieni Firestore database
const getDb = () => {
  if (!firebaseAdmin) {
    throw new Error('Firebase non è stato inizializzato correttamente');
  }
  return firebaseAdmin.firestore();
};

module.exports = {
  admin: firebaseAdmin,
  db: firebaseAdmin ? getDb() : null
};

