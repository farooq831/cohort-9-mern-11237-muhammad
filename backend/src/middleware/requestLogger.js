const pinoHttp = require('pino-http');
const logger = require('../utils/logger');

/**
 * Logs every incoming HTTP request and its response:
 * method, url, status code, and response time.
 * Uses the same pino instance or config as the rest of the app,
 * so all logs stay consistent (same redaction, same format).
 */
const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} failed with ${res.statusCode}`;
  },
});

module.exports = requestLogger;