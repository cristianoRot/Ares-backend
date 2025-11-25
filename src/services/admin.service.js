/**
 * Admin Service
 * Handles admin operations like listing all users
 */

const { admin, db } = require('../../config/firebase');

class AdminService {
  /**
   * Get all users (Firebase Auth data only, no Firestore profiles)
   * Returns only Firebase Auth data without Firestore profile data
   */
  async getAllUsers() {
    try {
      const allUsers = [];
      let nextPageToken;

      // Firebase Admin SDK limits to 1000 users per page
      // We need to iterate to get all users
      do {
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
        allUsers.push(...listUsersResult.users);
        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken);

      // Map to return only Firebase Auth data
      const usersData = allUsers.map((user) => {
        return {
          uid: user.uid,
          email: user.email || null,
          emailVerified: user.emailVerified || false,
          displayName: user.displayName || null,
          disabled: user.disabled || false,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime || null
          },
          customClaims: user.customClaims || {}
        };
      });

      // Sort by creation time (newest first)
      usersData.sort((a, b) => {
        const dateA = new Date(a.metadata.creationTime);
        const dateB = new Date(b.metadata.creationTime);
        return dateB - dateA;
      });

      return {
        total: usersData.length,
        users: usersData,
        stats: {
          total: usersData.length,
          emailVerified: usersData.filter(u => u.emailVerified).length,
          emailNotVerified: usersData.filter(u => !u.emailVerified).length,
          disabled: usersData.filter(u => u.disabled).length,
          admin: usersData.filter(u => u.customClaims?.admin === true).length
        }
      };
    } catch (error) {
      throw {
        code: 'ADMIN_ERROR',
        message: error.message || 'Failed to retrieve users'
      };
    }
  }

  /**
   * Get users count only (faster than getAllUsers)
   */
  async getUsersCount() {
    try {
      let count = 0;
      let nextPageToken;

      do {
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
        count += listUsersResult.users.length;
        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken);

      return { count };
    } catch (error) {
      throw {
        code: 'ADMIN_ERROR',
        message: error.message || 'Failed to count users'
      };
    }
  }

  /**
   * Set admin custom claim for a user by email
   */
  async setAdminClaimByEmail(targetUserEmail, isAdmin = true) {
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());
      
      // Set admin custom claim
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: isAdmin });
      
      return {
        success: true,
        message: `Admin privileges ${isAdmin ? 'granted' : 'revoked'} successfully for ${targetUserEmail}`,
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          admin: isAdmin
        }
      };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw {
          code: 'USER_NOT_FOUND',
          message: `User with email ${targetUserEmail} not found`
        };
      }
      throw {
        code: 'ADMIN_ERROR',
        message: error.message || 'Failed to set admin claim'
      };
    }
  }

  /**
   * Set admin custom claim for a user by UID (legacy method)
   */
  async setAdminClaim(uid, isAdmin = true) {
    try {
      await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
      return { success: true, message: `Admin claim ${isAdmin ? 'granted' : 'revoked'} successfully` };
    } catch (error) {
      throw {
        code: 'ADMIN_ERROR',
        message: error.message || 'Failed to set admin claim'
      };
    }
  }
}

module.exports = new AdminService();
