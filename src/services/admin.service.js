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
    const allUsers = [];
    let nextPageToken;

    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      allUsers.push(...listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    const usersData = allUsers.map((user) => ({
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
    }));

    usersData.sort((a, b) => {
      const dateA = new Date(a.metadata.creationTime);
      const dateB = new Date(b.metadata.creationTime);
      return dateB - dateA;
    });

    return {
      total: usersData.length,
      users: usersData
    };
  }

  /**
   * Get users count only (faster than getAllUsers)
   */
  async getUsersCount() {
    let count = 0;
    let nextPageToken;

    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      count += listUsersResult.users.length;
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    return { count };
  }

  /**
   * Set admin custom claim for a user by email
   */
  async setAdminClaimByEmail(targetUserEmail, isAdmin = true) {
    const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: isAdmin });
    
    return {
      message: `Admin privileges ${isAdmin ? 'granted' : 'revoked'} successfully for ${targetUserEmail}`,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        admin: isAdmin
      }
    };
  }

  /**
   * Delete user by email (admin only)
   */
  async deleteUserByEmail(targetUserEmail) {
    const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());
    const uid = userRecord.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    const username = userDoc.exists ? userDoc.data().username : null;

    await admin.auth().deleteUser(uid);

    if (username) {
      await db.collection('usernames').doc(username).delete();
    }

    if (userDoc.exists) {
      await db.collection('users').doc(uid).delete();
    }

    return {
      message: `User ${targetUserEmail} deleted successfully`,
      data: {
        uid: uid,
        email: targetUserEmail
      }
    };
  }

  /**
   * Disable or enable user by email (admin only)
   */
  async setUserDisabled(targetUserEmail, disabled = true) {
    const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());
    await admin.auth().updateUser(userRecord.uid, { disabled: disabled });

    return {
      message: `User ${targetUserEmail} ${disabled ? 'disabled' : 'enabled'} successfully`,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        disabled: disabled
      }
    };
  }


  /**
   * Update user profile data in Firestore (admin only)
   * Can update: coins, xp, kills, deaths, matches, skinTag, friends, guns, friendRequests
   */
  async updateUserProfile(targetUserEmail, profileData) {
    const userRecord = await admin.auth().getUserByEmail(targetUserEmail.trim());
    const uid = userRecord.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw {
        code: 'PROFILE_NOT_FOUND',
        message: `User profile not found for ${targetUserEmail}`
      };
    }

    const allowedFields = ['coins', 'xp', 'kills', 'deaths', 'matches', 'skinTag', 'friends', 'guns', 'friendRequests'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (profileData[field] !== undefined) {
        updateData[field] = profileData[field];
      }
    }

    updateData.updatedAt = new Date().toISOString();
    await db.collection('users').doc(uid).update(updateData);

    const updatedData = (await db.collection('users').doc(uid).get()).data();

    return {
      message: `User profile updated successfully for ${targetUserEmail}`,
      data: {
        uid: uid,
        email: targetUserEmail,
        profile: updatedData
      }
    };
  }
}

module.exports = new AdminService();
