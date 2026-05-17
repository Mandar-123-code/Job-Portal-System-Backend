const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * APPLY FOR JOB
 */
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.user.id;
    const role = req.user.role;

    if (role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates are allowed to apply for jobs.",
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: "JobId is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // verify job not expired
    if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Job posting has expired' });
    }

    const alreadyApplied = await Application.findOne({
      jobId,
      applicantId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    const newApplication = new Application({
      jobId,
      applicantId,
    });

    await newApplication.save();

    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/**
 * GET APPLICANTS FOR A JOB (RECRUITER)
 */
router.get("/job/:jobId", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.user.role !== "recruiter" || job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const apps = await Application.find({
      jobId: req.params.jobId,
    }).populate("applicantId", "name email");

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * GET MY APPLICATIONS (CANDIDATE)
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({
      applicantId: req.user.id,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * WITHDRAW APPLICATION (CANDIDATE)
 * Condition: Only owner of the application can delete it, and only if status is "applied".
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.applicantId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to withdraw this application." });
    }

    const currentStatus = app.status || "applied";
    if (currentStatus !== "applied") {
      return res.status(400).json({ 
        message: "You can only withdraw applications that are still 'applied'. Applications that are under review, accepted, or rejected cannot be withdrawn." 
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * UPDATE APPLICATION STATUS (RECRUITER)
 */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["applied", "interviewing", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(app.jobId);

    if (!job) {
      return res.status(404).json({ message: "Associated job not found" });
    }

    if (req.user.role !== "recruiter" || job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update status for this application." });
    }

    app.status = status;
    await app.save();

    res.json({ message: "Application status updated successfully", application: app });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;