const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users (with pagination, search, filter)
// @route   GET /api/users
// @access  Private/Admin/Manager
const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  if (req.query.role) query.role = req.query.role;
  if (req.query.status) query.status = req.query.status;
  
  const count = await User.countDocuments(query);
  const users = await User.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  res.status(200).json({
    users,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    createdBy: req.user._id,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin/Manager
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Security check: Manager cannot update Admin users
  if (req.user.role === 'manager' && user.role === 'admin') {
    res.status(403);
    throw new Error('Managers cannot modify Admin accounts');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.status = req.body.status || user.status;
  user.updatedBy = req.user._id;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    status: updatedUser.status,
  });
});

// @desc    Deactivate user (Soft Delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot deactivate your own account');
  }

  user.status = 'inactive';
  await user.save();

  res.status(200).json({ message: 'User deactivated successfully' });
});

// @desc    Get user profile (Self)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile (Self)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      token: req.headers.authorization.split(' ')[1],
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserProfile,
  updateUserProfile,
};
