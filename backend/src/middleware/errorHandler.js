const logger = require('../utils/logger');

// keeping this last in app.js so it catches errors from every route
const errorHandler = (err, req, res, next) => {
  // Mongo throws this specific error when a unique field (like email) is duplicated
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    logger.warn({ err }, `Duplicate value for field: ${field}`);
    return res.status(409).json({
      success: false,
      message: `${field} already in use`,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';

  logger.error({ err }, message);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;