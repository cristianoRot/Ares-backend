/**
 * User Model
 * Defines the user data structure in Firestore
 */

class UserModel {
  constructor(data = {}) {
    this.username = data.username || '';
    this.email = data.email || '';
    this.uid = data.uid || '';
    this.coins = data.coins || 0;
    this.xp = data.xp || 0;
    this.kills = data.kills || 0;
    this.deaths = data.deaths || 0;
    this.matches = data.matches || 0;
    this.skinTag = data.skinTag || 0;
    this.friends = data.friends || [];
    this.guns = data.guns || [];
    this.friendRequests = data.friendRequests || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Convert model to plain object for Firebase
   */
  toFirestore() {
    return {
      username: this.username,
      email: this.email,
      coins: this.coins,
      xp: this.xp,
      kills: this.kills,
      deaths: this.deaths,
      matches: this.matches,
      skinTag: this.skinTag,
      friends: this.friends,
      guns: this.guns,
      friendRequests: this.friendRequests,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create UserModel instance from Firestore document
   */
  static fromFirestore(doc) {
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    return new UserModel({
      ...data,
      uid: doc.id
    });
  }

  /**
   * Validate minimum required data for creation
   */
  static validate(data) {
    const errors = [];

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Invalid email address');
    }

    if (!data.username || data.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = UserModel;
