/**
 * Authentication Service
 * Gestisce tutta la logica di autenticazione Firebase
 */

const { admin, db } = require('../../config/firebase');
const UserModel = require('../models/User.model');

class AuthService {
  /**
   * Registra un nuovo utente con email, password e username
   * Replica la logica di FirebaseAuthManager.Register() da Unity
   */
  async register(email, password, username) {
    try {
      // 1. Crea l'utente in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: username
      });

      // 2. Salva l'username nella collection "usernames" (per unicità)
      await this.saveUsername(username, userRecord.uid);

      // 3. Crea il profilo utente nella collection "users"
      const userProfile = await this.createUserProfile(userRecord.uid, username, email);

      return {
        success: true,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          username: username,
          profile: userProfile
        }
      };
    } catch (error) {
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Salva l'username nella collection "usernames"
   * Permette di verificare unicità e fare lookup username -> uid
   */
  async saveUsername(username, uid) {
    try {
      const usernameRef = db.collection('usernames').doc(username);
      
      // Verifica se username è già preso
      const usernameDoc = await usernameRef.get();
      if (usernameDoc.exists) {
        throw {
          code: 'auth/username-already-exists',
          message: 'Username già in uso'
        };
      }

      // Salva il mapping username -> uid
      await usernameRef.set({
        uid: uid,
        createdAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea il profilo iniziale dell'utente nella collection "users"
   * Replica la logica di CreateNewProfileData() da Unity
   */
  async createUserProfile(uid, username, email) {
    try {
      const userModel = new UserModel({
        uid: uid,
        username: username,
        email: email,
        coins: 0,
        xp: 0,
        kills: 0,
        deaths: 0,
        matches: 0,
        skinTag: 0,
        friends: [],
        guns: [],
        friendRequests: []
      });

      const userRef = db.collection('users').doc(uid);
      await userRef.set(userModel.toFirestore());

      return userModel;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ottiene un utente per UID
   */
  async getUserByUid(uid) {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      return UserModel.fromFirestore(userDoc);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ottiene un utente per username
   */
  async getUserByUsername(username) {
    try {
      // Prima trova l'uid dal username
      const usernameDoc = await db.collection('usernames').doc(username).get();
      if (!usernameDoc.exists) {
        return null;
      }

      const uid = usernameDoc.data().uid;
      return await this.getUserByUid(uid);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Elimina un utente e tutti i suoi dati
   */
  async deleteUser(uid) {
    try {
      // Ottieni username prima di eliminare il documento
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const username = userDoc.data().username;
        
        // Elimina da Firebase Auth
        await admin.auth().deleteUser(uid);
        
        // Elimina il documento username
        if (username) {
          await db.collection('usernames').doc(username).delete();
        }
        
        // Elimina il profilo utente
        await db.collection('users').doc(uid).delete();
      }

      return { success: true, message: 'Utente eliminato con successo' };
    } catch (error) {
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Gestisce gli errori Firebase e li converte in messaggi leggibili
   */
  handleFirebaseError(error) {
    const errorMessages = {
      'auth/email-already-exists': 'Email già registrata',
      'auth/invalid-email': 'Email non valida',
      'auth/invalid-password': 'Password troppo debole (minimo 6 caratteri)',
      'auth/user-not-found': 'Utente non trovato',
      'auth/username-already-exists': 'Username già in uso',
      'auth/weak-password': 'Password troppo debole',
      'auth/operation-not-allowed': 'Operazione non permessa',
      'auth/uid-already-exists': 'UID già esistente'
    };

    return {
      code: error.code || 'auth/unknown-error',
      message: errorMessages[error.code] || error.message || 'Errore sconosciuto'
    };
  }
}

module.exports = new AuthService();

