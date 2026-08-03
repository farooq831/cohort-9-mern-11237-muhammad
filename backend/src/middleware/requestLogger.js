const pinoHttp = require('pino-http');
const logger = require('../utils/logger');

/**
 * Logs every incoming HTTP request and its response:
 * method, path, status code, and response time.
 * Query strings are stripped everywhere (msg text AND the
 * structured req object) so secrets like ?token=... never
 * end up in logs, no matter which part of the log entry
 * someone is reading.
 */
const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url.split('?')[0]} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url.split('?')[0]} failed with ${res.statusCode}`;
  },
  serializers: {
    req: (req) => {
      const serialized = pinoHttp.stdSerializers.req(req);
      serialized.url = serialized.url.split('?')[0];
      delete serialized.query;
      return serialized;
    },
  },
});

module.exports = requestLogger;
