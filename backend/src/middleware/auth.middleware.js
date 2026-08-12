const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Not authorized, no token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch (err) {
    next(new AppError('Not authorized, invalid or expired token', 401));
  }
};

module.exports = protect;