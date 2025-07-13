const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Public Routes
router.post('/register', register);   // /api/auth/register
router.post('/login', login);         // /api/auth/login

// ✅ Protected Route (requires token)
router.get('/profile', authMiddleware, getProfile);  // /api/auth/profile

module.exports = router;
