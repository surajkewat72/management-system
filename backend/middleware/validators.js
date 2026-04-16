const { body, validationResult } = require('express-validator');

/**
 * @desc    Middleware to validate inputs and handle results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Pass errors to the global error handler
    return next(errors);
  }
  next();
};

const registerSchema = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

const loginSchema = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const userSchema = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('role').optional().isIn(['user', 'manager', 'admin']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

module.exports = {
  registerSchema,
  loginSchema,
  userSchema,
};
