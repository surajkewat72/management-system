const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../middleware/validators');

router.post('/register', registerSchema, registerUser);
router.post('/login', loginSchema, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
