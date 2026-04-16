const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, authorize('admin', 'manager'), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/:id')
  .get(protect, authorize('admin', 'manager'), getUserById)
  .put(protect, authorize('admin', 'manager'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
