const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
