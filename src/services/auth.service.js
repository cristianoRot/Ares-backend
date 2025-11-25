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
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username
    });

    await this.saveUsername(username, userRecord.uid);
    const userProfile = await this.createUserProfile(userRecord.uid, username, email);

    return {
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        username: username,
        profile: userProfile
      }
    };
  }

  /**
   * Save username in "usernames" collection
   */
  async saveUsername(username, uid) {
    const usernameRef = db.collection('usernames').doc(username);
    const usernameDoc = await usernameRef.get();
    
    if (usernameDoc.exists) {
      throw {
        code: 'auth/username-already-exists',
        message: 'Username is already taken'
      };
    }

    await usernameRef.set({
      uid: uid,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * Create initial user profile in "users" collection
   */
  async createUserProfile(uid, username, email) {
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

    await db.collection('users').doc(uid).set(userModel.toFirestore());
    return userModel;
  }

  /**
   * Get user by UID
   */
  async getUserByUid(uid) {
    const userDoc = await db.collection('users').doc(uid).get();
    return UserModel.fromFirestore(userDoc);
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username) {
    const usernameDoc = await db.collection('usernames').doc(username).get();
    if (!usernameDoc.exists) {
      return null;
    }
    const uid = usernameDoc.data().uid;
    return await this.getUserByUid(uid);
  }

  /**
   * Verify password using Firebase REST API
   */
  async verifyPassword(email, password) {
    if (!process.env.FIREBASE_WEB_API_KEY) {
      throw {
        code: 'SERVER_CONFIGURATION_ERROR',
        message: 'Server is not configured for password verification'
      };
    }

    const axios = require('axios');
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
        {
          email: email.trim(),
          password: password,
          returnSecureToken: true
        }
      );
      return response.data.localId;
    } catch (error) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }
  }

  /**
   * Get user by username with credential verification
   */
  async getUserByUsernameWithAuth(username, email, password) {
    const user = await this.getUserByUsername(username);
    if (!user) {
      throw { code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    const authenticatedUid = await this.verifyPassword(email, password);
    
    if (authenticatedUid !== user.uid) {
      throw { code: 'FORBIDDEN', message: 'Credentials do not match the requested username' };
    }

    return user;
  }

  /**
   * Delete user by email and password (verifies credentials first)
   */
  async deleteUserByCredentials(email, password) {
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email.trim());
    } catch (error) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    await this.verifyPassword(email, password);
    await this.deleteUser(userRecord.uid);
    
    return { message: 'User deleted successfully' };
  }

  /**
   * Delete user and all associated data by UID
   */
  async deleteUser(uid) {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      const username = userDoc.data().username;
      
      await admin.auth().deleteUser(uid);
      
      if (username) {
        await db.collection('usernames').doc(username).delete();
      }
      
      await db.collection('users').doc(uid).delete();
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
