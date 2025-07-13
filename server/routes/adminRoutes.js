const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Get all users
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Get all jobs
router.get('/jobs', adminMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'username email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
});

module.exports = router;
