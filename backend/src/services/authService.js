const bcrypt = require('bcrypt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const signup = async ({ name, email, password }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email is already registered', 409);
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password_hash });

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.code === 11000) {
      throw new AppError('Email is already registered', 409);
    }
    throw new AppError('Signup failed, please try again', 500);
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email }).select('+password_hash');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Login failed, please try again', 500);
  }
};

module.exports = { signup, login };