const AppError = require('../utils/AppError');

// runs when no route matched, passes a 404 error down to errorHandler
const notFound = (req, res, next) => {
  const path = req.originalUrl.split('?')[0];
  next(new AppError(`Route ${path} not found`, 404));
};

module.exports = notFound;