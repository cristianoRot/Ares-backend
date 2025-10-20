/**
 * Response Utilities
 * Fornisce helper per creare risposte HTTP standardizzate
 */

class ResponseUtil {
  /**
   * Risposta di successo
   */
  static success(res, data, message = 'Operazione completata con successo', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Risposta di errore
   */
  static error(res, message, statusCode = 500, errorCode = null) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      ...(errorCode && { code: errorCode }),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Risposta di validazione fallita
   */
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      error: 'Errore di validazione',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Risposta di risorsa non trovata
   */
  static notFound(res, message = 'Risorsa non trovata') {
    return res.status(404).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Risposta di non autorizzato
   */
  static unauthorized(res, message = 'Non autorizzato') {
    return res.status(401).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Risposta di forbidden
   */
  static forbidden(res, message = 'Accesso negato') {
    return res.status(403).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ResponseUtil;

