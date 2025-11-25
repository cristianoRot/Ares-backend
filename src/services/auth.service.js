/**
 * Authentication Service
 * Handles all Firebase authentication business logic
 */

const { admin, db } = require('../../config/firebase');
const UserModel = require('../models/User.model');

class AuthService {
  /**
   * Register a new user with email, password and username
   * Replicates the logic from FirebaseAuthManager.Register() in Unity
   */
  async register(email, password, username) {
    try {
      // 1. Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: username
      });

      // 2. Save username in "usernames" collection (for uniqueness)
      await this.saveUsername(username, userRecord.uid);

      // 3. Create user profile in "users" collection
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
   * Save username in "usernames" collection
   * Allows checking uniqueness and username -> uid lookup
   */
  async saveUsername(username, uid) {
    try {
      const usernameRef = db.collection('usernames').doc(username);
      
      // Check if username is already taken
      const usernameDoc = await usernameRef.get();
      if (usernameDoc.exists) {
        throw {
          code: 'auth/username-already-exists',
          message: 'Username is already taken'
        };
      }

      // Save username -> uid mapping
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
   * Create initial user profile in "users" collection
   * Replicates the logic from CreateNewProfileData() in Unity
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
   * Get user by UID
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
   * Get user by username
   */
  async getUserByUsername(username) {
    try {
      // First find uid from username
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
   * Verify credentials and get user by username
   * Returns user data if credentials match the username OR if user is admin
   */
  async getUserByUsernameWithAuth(username, email, password) {
    try {
      // Get user by username
      const user = await this.getUserByUsername(username);
      if (!user) {
        throw {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        };
      }

      // Get Firebase Auth user record by email
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(email.trim());
      } catch (error) {
        throw {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        };
      }

      // Always verify password using Firebase REST API
      if (!process.env.FIREBASE_WEB_API_KEY) {
        throw {
          code: 'SERVER_CONFIGURATION_ERROR',
          message: 'Server is not configured for password verification. Missing FIREBASE_WEB_API_KEY.'
        };
      }

      // Verify password - this must succeed for both regular users and admins
      try {
        const axios = require('axios');
        await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
          {
            email: email.trim(),
            password: password,
            returnSecureToken: true
          }
        );
      } catch (error) {
        // Password verification failed - reject even if user is admin
        throw {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        };
      }

      // Check if credentials match the username OR if user is admin
      const customClaims = userRecord.customClaims || {};
      const isAdmin = customClaims.admin === true;
      const credentialsMatch = userRecord.uid === user.uid;

      if (!credentialsMatch && !isAdmin) {
        throw {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this user data'
        };
      }

      return user;
    } catch (error) {
      if (error.code === 'USER_NOT_FOUND' || error.code === 'INVALID_CREDENTIALS' || error.code === 'FORBIDDEN') {
        throw error;
      }
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Delete user by email and password (verifies credentials first)
   */
  async deleteUserByCredentials(email, password) {
    try {
      // Get user by email
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(email.trim());
      } catch (error) {
        throw {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        };
      }

      // Verify password using Firebase REST API if Web API Key is available
      if (process.env.FIREBASE_WEB_API_KEY) {
        try {
          const axios = require('axios');
          await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
            {
              email: email.trim(),
              password: password,
              returnSecureToken: true
            }
          );
        } catch (error) {
          throw {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          };
        }
      } else {
        console.warn('[AuthService] FIREBASE_WEB_API_KEY not set. Password verification skipped.');
      }

      // If credentials are valid, proceed with deletion
      return await this.deleteUser(userRecord.uid);
    } catch (error) {
      if (error.code === 'INVALID_CREDENTIALS') {
        throw error;
      }
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Delete user and all associated data by UID
   */
  async deleteUser(uid) {
    try {
      // Get username before deleting the document
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const username = userDoc.data().username;
        
        // Delete from Firebase Auth
        await admin.auth().deleteUser(uid);
        
        // Delete username document
        if (username) {
          await db.collection('usernames').doc(username).delete();
        }
        
        // Delete user profile
        await db.collection('users').doc(uid).delete();
      }

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Handle Firebase errors and convert them to readable messages
   */
  handleFirebaseError(error) {
    const errorMessages = {
      'auth/email-already-exists': 'Email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/invalid-password': 'Password is too weak (minimum 6 characters)',
      'auth/user-not-found': 'User not found',
      'auth/username-already-exists': 'Username is already taken',
      'auth/weak-password': 'Password is too weak',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/uid-already-exists': 'UID already exists'
    };

    return {
      code: error.code || 'auth/unknown-error',
      message: errorMessages[error.code] || error.message || 'Unknown error occurred'
    };
  }
}

module.exports = new AuthService();
