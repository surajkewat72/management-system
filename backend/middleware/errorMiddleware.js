/**
 * @desc    Standardized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  // If the error is a validation error from express-validator
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.array(),
    });
  }

  // Handle Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Handle Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Handle Prisma "Table does not exist" error
  if (err.code === 'P2021') {
    return res.status(503).json({
      message: 'System initialization incomplete. Please run database setup (sync schema and seed).',
    });
  }

  // Default error
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
