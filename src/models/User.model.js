/**
 * User Model
 * Definisce la struttura dati dell'utente in Firestore
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
   * Converte il modello in un oggetto semplice per Firebase
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
   * Crea un'istanza UserModel da un documento Firestore
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
   * Valida i dati minimi richiesti per la creazione
   */
  static validate(data) {
    const errors = [];

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Email non valida');
    }

    if (!data.username || data.username.length < 3) {
      errors.push('Username deve essere almeno 3 caratteri');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password deve essere almeno 6 caratteri');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida formato email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = UserModel;

