const express = require("express");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

/**
 * GET CURRENT USER PROFILE
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * UPDATE CURRENT USER PROFILE
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatePayload = {};

    if (name) updatePayload.name = name;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updatePayload.email = email;
    }
    if (password) {
      updatePayload.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updatePayload,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;