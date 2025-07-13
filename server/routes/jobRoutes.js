const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Job = require('../models/Job');
const User = require('../models/User');

// ✅ POST: Only Admin can create a job
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can post jobs' });
    }

    const { title, description, location, type } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      type,
      createdBy: req.user.userId
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ message: 'Error creating job', error: err.message });
  }
});

// ✅ GET: All jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'username email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
});

// ✅ GET: Admin - jobs created by the logged-in admin
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const jobs = await Job.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin jobs', error: err.message });
  }
});

// ✅ PUT: Update job (by job creator or admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const isOwner = job.createdBy.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Only owner or admin can update' });
    }

    const { title, description, location, type } = req.body;

    job.title = title;
    job.description = description;
    job.location = location;
    job.type = type;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
});

// ✅ DELETE: Job (by job creator or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const isOwner = job.createdBy.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Only owner or admin can delete' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
});

module.exports = router;
