/**
 * Admin Service
 * Handles admin operations like listing all users
 */

const { admin, db } = require('../../config/firebase');

class AdminService {
  /**
   * Get all users with their profiles
   * Returns both Firebase Auth data and Firestore profile data
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

      // Get profile data from Firestore for each user
      const usersWithProfiles = await Promise.all(
        allUsers.map(async (user) => {
          try {
            // Get user profile from Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            const profileData = userDoc.exists ? userDoc.data() : null;

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
              profile: profileData
            };
          } catch (error) {
            // If profile fetch fails, return user without profile
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
              profile: null,
              error: 'Failed to fetch profile data'
            };
          }
        })
      );

      // Sort by creation time (newest first)
      usersWithProfiles.sort((a, b) => {
        const dateA = new Date(a.metadata.creationTime);
        const dateB = new Date(b.metadata.creationTime);
        return dateB - dateA;
      });

      return {
        total: usersWithProfiles.length,
        users: usersWithProfiles,
        stats: {
          total: usersWithProfiles.length,
          emailVerified: usersWithProfiles.filter(u => u.emailVerified).length,
          emailNotVerified: usersWithProfiles.filter(u => !u.emailVerified).length,
          disabled: usersWithProfiles.filter(u => u.disabled).length,
          withProfile: usersWithProfiles.filter(u => u.profile !== null).length,
          withoutProfile: usersWithProfiles.filter(u => u.profile === null).length
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
