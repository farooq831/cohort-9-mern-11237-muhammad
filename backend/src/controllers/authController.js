const authService = require('../services/authService');
const { validateSignupInput, validateLoginInput } = require('../utils/validators');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const isValidPayload = (body) => {
  return body && typeof body === 'object' && !Array.isArray(body);
};

const signup = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!isValidPayload(body)) {
      throw new AppError('Invalid request payload', 400);
    }

    const errors = validateSignupInput(body);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400);
    }

    const result = await authService.signup(body);
    logger.info({ userId: result.user.id }, 'User signed up successfully');

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!isValidPayload(body)) {
      throw new AppError('Invalid request payload', 400);
    }

    const errors = validateLoginInput(body);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400);
    }

    const result = await authService.login(body);
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
