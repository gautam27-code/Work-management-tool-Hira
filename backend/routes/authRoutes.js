// ============================
// Auth Routes
// ============================
// POST  /api/auth/signup  → Register a new user
// POST  /api/auth/login   → Login and get JWT token
// GET   /api/auth/me      → Get current user (protected)

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ---- Helper: Generate JWT Token ----
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// ---- POST /api/auth/signup ----
// Register a new user
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user (password is hashed automatically by the pre-save hook)
    const user = await User.create({ name, email, password });

    // Send back user data + token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---- POST /api/auth/login ----
// Login with email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---- GET /api/auth/me ----
// Get current logged-in user's data (protected route)
router.get("/me", protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;