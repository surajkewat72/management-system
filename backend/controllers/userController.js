const { prisma } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');

// Helper to map Prisma user to frontend format
const mapUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    _id: user.id,
    role: user.role.toLowerCase(),
    status: user.status.toLowerCase(),
    // Handle populated fields if they exist
    createdBy: user.createdBy ? { ...user.createdBy, _id: user.createdBy.id } : user.createdById,
    updatedBy: user.updatedBy ? { ...user.updatedBy, _id: user.updatedBy.id } : user.updatedById,
  };
};

// @desc    Get all users (with pagination, search, filter)
// @route   GET /api/users
// @access  Private/Admin/Manager
const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (req.query.search) {
    where.OR = [
      { name: { contains: req.query.search, mode: 'insensitive' } },
      { email: { contains: req.query.search, mode: 'insensitive' } },
    ];
  }

  if (req.query.role) where.role = req.query.role.toUpperCase();
  if (req.query.status) where.status = req.query.status.toUpperCase();
  
  const count = await prisma.user.count({ where });
  const users = await prisma.user.findMany({
    where,
    take: limit,
    skip: skip,
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    users: users.map(mapUser),
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      createdBy: { select: { id: true, name: true } },
      updatedBy: { select: { id: true, name: true } },
    },
  });

  if (user) {
    res.status(200).json(mapUser(user));
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

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role ? role.toUpperCase() : 'USER',
      createdById: req.user.id,
    },
  });

  res.status(201).json(mapUser(user));
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin/Manager
const updateUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Security check: Manager cannot update Admin users
  if (req.user.role === 'manager' && user.role === 'ADMIN') {
    res.status(403);
    throw new Error('Managers cannot modify Admin accounts');
  }

  const data = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
    role: req.body.role ? req.body.role.toUpperCase() : user.role,
    status: req.body.status ? req.body.status.toUpperCase() : user.status,
    updatedById: req.user.id,
  };

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.params.id },
    data,
  });

  res.status(200).json(mapUser(updatedUser));
});

// @desc    Deactivate user (Soft Delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.id === req.user.id) {
    res.status(400);
    throw new Error('You cannot deactivate your own account');
  }

  await prisma.user.update({
    where: { id: req.params.id },
    data: { status: 'INACTIVE' },
  });

  res.status(200).json({ message: 'User deactivated successfully' });
});

// @desc    Get user profile (Self)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (user) {
    res.status(200).json(mapUser(user));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile (Self)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (user) {
    const data = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
    };

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    res.status(200).json({
      ...mapUser(updatedUser),
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
