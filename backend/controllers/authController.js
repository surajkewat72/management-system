const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Manual duplicate check (or let Mongoose handle it and errorHandler catch it)
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    if (user.status !== 'active') {
      res.status(403);
      throw new Error('Account is inactive. Please contact admin.');
    }

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
