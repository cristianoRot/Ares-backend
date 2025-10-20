const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Option 1: Use environment variables (recommended for production)
      if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          })
        });
        console.log('[Firebase] Initialized with environment variables');
      } 
      // Option 2: Use serviceAccountKey.json file (for local development)
      else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('[Firebase] Initialized with service account file');
      } else {
        console.warn('[Firebase] Not configured - add credentials in environment variables');
      }
    }

    return admin;
  } catch (error) {
    console.error('[Firebase] Error initializing:', error.message);
    return null;
  }
};

// Initialize Firebase
const firebaseAdmin = initializeFirebase();

// Get Firestore database
const getDb = () => {
  if (!firebaseAdmin) {
    return null;
  }
  try {
    return firebaseAdmin.firestore();
  } catch (error) {
    console.error('[Firebase] Error accessing Firestore:', error.message);
    return null;
  }
};

// Export only if Firebase is properly initialized
const db = firebaseAdmin ? getDb() : null;

module.exports = {
  admin: firebaseAdmin,
  db: db
};
