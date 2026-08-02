const AppError = require('../utils/AppError');

// runs when no route matched, passes a 404 error down to errorHandler
const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

module.exports = notFound;