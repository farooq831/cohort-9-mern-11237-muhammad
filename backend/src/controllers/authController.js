const authService = require('../services/authService');
const { validateSignupInput, validateLoginInput } = require('../utils/validators');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const signup = async (req, res, next) => {
  try {
    const errors = validateSignupInput(req.body);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400);
    }

    const result = await authService.signup(req.body);
    logger.info({ userId: result.user.id }, 'User signed up successfully');

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validateLoginInput(req.body);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400);
    }

    const result = await authService.login(req.body);
    logger.info({ userId: result.user.id }, 'User logged in successfully');

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  // token is stored client-side, so logout just tells the client to discard it
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = { signup, login, logout };