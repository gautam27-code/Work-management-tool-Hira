// server.js - Main Entry Point
// ============================
// This is the main file that starts the Express server
// and connects to MongoDB database.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import routes
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

// Create Express app
const app = express();

// ---- Middleware ----
// Enable CORS so frontend can talk to backend
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// ---- Routes ----
// Auth routes (login, signup)
app.use("/api/auth", authRoutes);
// All task-related routes start with /api/tasks
app.use("/api/tasks", taskRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Hira API! 🚀" });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hira";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    // Start the server only after DB connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });
