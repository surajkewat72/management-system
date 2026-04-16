const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { userSchema } = require('../middleware/validators');

router
  .route('/')
  .get(protect, authorize('admin', 'manager'), getUsers)
  .post(protect, authorize('admin'), userSchema, createUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, userSchema, updateUserProfile);

router
  .route('/:id')
  .get(protect, authorize('admin', 'manager'), getUserById)
  .put(protect, authorize('admin', 'manager'), userSchema, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
