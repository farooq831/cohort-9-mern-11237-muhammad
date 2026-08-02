const logger = require('../utils/logger');

// keeping this last in app.js so it catches errors from every route
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';

  logger.error({ err }, message);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;