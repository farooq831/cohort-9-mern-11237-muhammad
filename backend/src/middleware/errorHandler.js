const logger = require('../utils/logger');

// keeping this last in app.js so it catches errors from every route
const errorHandler = (err, req, res, next) => {
  // Mongo throws this specific error when a unique field (like email) is duplicated
  if (err.code === 11000) {
    const duplicateFields = err.keyValue ? Object.keys(err.keyValue) : [];
    const message = duplicateFields.length
      ? `${duplicateFields.join(', ')} already in use`
      : 'Duplicate value already in use';

    logger.warn(
      { code: err.code, fields: duplicateFields },
      'Duplicate key error'
    );

    return res.status(409).json({
      success: false,
      message,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';

  logger.error(
    { name: err.name, message: err.message, statusCode },
    message
  );

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
