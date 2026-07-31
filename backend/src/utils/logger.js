const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Pretty, readable logs in development; plain JSON logs in production
  // (JSON logs are what most log aggregators like Datadog/ELK expect)
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
  // Redact sensitive fields so they never end up in log output
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'password_hash',
      'token',
    ],
    censor: '[REDACTED]',
  },
});

module.exports = logger;