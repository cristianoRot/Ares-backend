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

  /**
   * Delete user by email (admin only)
   */
  async deleteUserByEmail(targetUserEmail) {
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());
      const uid = userRecord.uid;

      // Get username before deleting the document
      const userDoc = await db.collection('users').doc(uid).get();
      let username = null;
      if (userDoc.exists) {
        username = userDoc.data().username;
      }

      // Delete from Firebase Auth
      await admin.auth().deleteUser(uid);

      // Delete username document
      if (username) {
        await db.collection('usernames').doc(username).delete();
      }

      // Delete user profile
      if (userDoc.exists) {
        await db.collection('users').doc(uid).delete();
      }

      return {
        success: true,
        message: `User ${targetUserEmail} deleted successfully`,
        data: {
          uid: uid,
          email: targetUserEmail
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
        message: error.message || 'Failed to delete user'
      };
    }
  }

  /**
   * Disable or enable user by email (admin only)
   */
  async setUserDisabled(targetUserEmail, disabled = true) {
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());

      // Update user disabled status
      await admin.auth().updateUser(userRecord.uid, {
        disabled: disabled
      });

      return {
        success: true,
        message: `User ${targetUserEmail} ${disabled ? 'disabled' : 'enabled'} successfully`,
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          disabled: disabled
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
        message: error.message || 'Failed to update user status'
      };
    }
  }

  /**
   * Update user custom claims (admin only)
   */
  async updateUserCustomClaims(targetUserEmail, customClaims) {
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());

      // Merge with existing custom claims (preserve admin if not specified)
      const existingClaims = userRecord.customClaims || {};
      const updatedClaims = { ...existingClaims, ...customClaims };

      // Set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, updatedClaims);

      return {
        success: true,
        message: `Custom claims updated successfully for ${targetUserEmail}`,
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          customClaims: updatedClaims
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
        message: error.message || 'Failed to update custom claims'
      };
    }
  }

  /**
   * Update user display name (admin only)
   */
  async updateUserDisplayName(targetUserEmail, displayName) {
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());

      // Update display name
      await admin.auth().updateUser(userRecord.uid, {
        displayName: displayName
      });

      return {
        success: true,
        message: `Display name updated successfully for ${targetUserEmail}`,
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: displayName
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
        message: error.message || 'Failed to update display name'
      };
    }
  }

  /**
   * Update user profile data in Firestore (admin only)
   * Can update: coins, xp, kills, deaths, matches, skinTag, friends, guns, friendRequests
   */
  async updateUserProfile(targetUserEmail, profileData) {
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());
      const uid = userRecord.uid;

      // Get current profile
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw {
          code: 'PROFILE_NOT_FOUND',
          message: `User profile not found for ${targetUserEmail}`
        };
      }

      // Prepare update data (only include allowed fields)
      const allowedFields = ['coins', 'xp', 'kills', 'deaths', 'matches', 'skinTag', 'friends', 'guns', 'friendRequests'];
      const updateData = {};
      
      for (const field of allowedFields) {
        if (profileData[field] !== undefined) {
          updateData[field] = profileData[field];
        }
      }

      // Add updatedAt timestamp
      updateData.updatedAt = new Date().toISOString();

      // Update Firestore document
      await db.collection('users').doc(uid).update(updateData);

      // Get updated profile
      const updatedDoc = await db.collection('users').doc(uid).get();
      const updatedData = updatedDoc.data();

      return {
        success: true,
        message: `User profile updated successfully for ${targetUserEmail}`,
        data: {
          uid: uid,
          email: targetUserEmail,
          profile: updatedData
        }
      };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw {
          code: 'USER_NOT_FOUND',
          message: `User with email ${targetUserEmail} not found`
        };
      }
      if (error.code === 'PROFILE_NOT_FOUND') {
        throw error;
      }
      throw {
        code: 'ADMIN_ERROR',
        message: error.message || 'Failed to update user profile'
      };
    }
  }
}

module.exports = new AdminService();
