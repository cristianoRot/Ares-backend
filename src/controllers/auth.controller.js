/**
 * Authentication Controller
 * Gestisce le richieste HTTP per l'autenticazione
 */

const authService = require('../services/auth.service');
const UserModel = require('../models/User.model');

class AuthController {
  /**
   * POST /api/auth/register
   * Registra un nuovo utente
   */
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      // Validazione input
      const validation = UserModel.validate({ email, password, username });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      // Registra l'utente
      const result = await authService.register(email, password, username);

      return res.status(201).json({
        success: true,
        message: 'Utente registrato con successo',
        data: {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.username,
          profile: result.user.profile.toFirestore()
        }
      });
    } catch (error) {
      console.error('Errore registrazione utente:', error);
      
      return res.status(400).json({
        success: false,
        error: error.message || 'Errore durante la registrazione',
        code: error.code || 'auth/unknown-error'
      });
    }
  }

  /**
   * GET /api/auth/user/:uid
   * Ottiene i dati di un utente per UID
   */
  async getUserByUid(req, res) {
    try {
      const { uid } = req.params;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: 'UID richiesto'
        });
      }

      const user = await authService.getUserByUid(uid);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utente non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        data: user.toFirestore()
      });
    } catch (error) {
      console.error('Errore recupero utente:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Errore durante il recupero dell\'utente'
      });
    }
  }

  /**
   * GET /api/auth/user/username/:username
   * Ottiene i dati di un utente per username
   */
  async getUserByUsername(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({
          success: false,
          error: 'Username richiesto'
        });
      }

      const user = await authService.getUserByUsername(username);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utente non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        data: user.toFirestore()
      });
    } catch (error) {
      console.error('Errore recupero utente:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Errore durante il recupero dell\'utente'
      });
    }
  }

  /**
   * DELETE /api/auth/user/:uid
   * Elimina un utente
   */
  async deleteUser(req, res) {
    try {
      const { uid } = req.params;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: 'UID richiesto'
        });
      }

      const result = await authService.deleteUser(uid);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Errore eliminazione utente:', error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Errore durante l\'eliminazione dell\'utente'
      });
    }
  }
}

module.exports = new AuthController();

