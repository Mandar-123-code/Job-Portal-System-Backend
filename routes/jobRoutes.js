const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE JOB (RECRUITER ONLY)
 */
router.post("/create", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can create jobs" });
    }

    const { title, company, location, salary, description, experience } = req.body;

    // basic validation
    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // create job with random expiration between 7 and 60 days
    const now = new Date();
    const randomDays = Math.floor(Math.random() * (60 - 7 + 1)) + 7; // 7..60
    const expiresAt = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);

    const newJob = new Job({
      title,
      company,
      location,
      salary,
      description,
      experience: experience || "Mid-Level",
      createdBy: req.user.id,
      postedAt: now,
      expiresAt,
    });

    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', newJob });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/**
 * GET ALL JOBS
 */
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};

    if (q) {
      const searchRegex = new RegExp(q, "i");
      filter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    const jobs = await Job.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/**
 * GET RECRUITER JOBS
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    // Calculate applicant count dynamically for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicantCount: count,
        };
      })
    );

    res.status(200).json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/**
 * DELETE JOB (ONLY CREATOR SHOULD DO THIS)
 */
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔥 security check
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * UPDATE JOB (ONLY CREATOR)
 */
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔥 security check
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;