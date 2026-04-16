const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, authorize('admin', 'manager'), getUsers);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
