const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const Application = require('../models/Application');
const Job = require('../models/Job');

// ✅ Apply to a job with resume
router.post('/:jobId', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const alreadyApplied = await Application.findOne({
      job: jobId,
      user: req.user.userId
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You already applied to this job' });
    }

    const newApp = new Application({
      job: jobId,
      user: req.user.userId,
      resumePath: req.file ? `resumes/${req.file.filename}` : undefined // ✅ FIXED PATH
    });

    await newApp.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Error applying for job', error: err.message });
  }
});

// ✅ User: Get their own applications
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.userId })
      .populate('job', 'title location type description')
      .sort({ appliedAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
});

// ✅ Admin: Get all applications to their jobs
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const jobs = await Job.find({ createdBy: req.user.userId });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title')
      .populate('user', 'username email')
      .sort({
        status: 1,          // 'pending' before 'approved'
        appliedAt: -1       // newest first
      });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
});

// ✅ Approve
router.put('/approve/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = 'approved';
    await application.save();

    res.json({ message: 'Application approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving', error: err.message });
  }
});

// ✅ Reject
router.put('/reject/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = 'rejected';
    await application.save();

    res.json({ message: 'Application rejected successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting', error: err.message });
  }
});

module.exports = router;
