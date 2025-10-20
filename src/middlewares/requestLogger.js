/**
 * Request Logger Middleware
 * Logga tutte le richieste HTTP
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log della richiesta
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Log della risposta quando completata
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ` +
      `${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
    );
  });
  
  next();
};

module.exports = requestLogger;

