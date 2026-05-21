// ============================
// server.js - Main Entry Point
// ============================
// This is the main file that starts the Express server
// and connects to MongoDB database.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("user:join", (userId) => {
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} joined user room ${userId}`);
  });

  socket.on("team:join", (teamId) => {
    socket.join(teamId.toString());
    console.log(`Socket ${socket.id} joined team ${teamId}`);
  });

  socket.on("team:leave", (teamId) => {
    socket.leave(teamId.toString());
    console.log(`Socket ${socket.id} left team ${teamId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Pass io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ---- Middleware ----
// Enable CORS so frontend can talk to backend
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- Routes ----
// Auth routes (login, signup)
app.use("/api/auth", authRoutes);
// Team routes (create, list, invite, join)
app.use("/api/teams", teamRoutes);
// Task routes (create, list by team, update)
app.use("/api/tasks", taskRoutes);
// Message routes (send, list by team)
app.use("/api/messages", messageRoutes);
// Activity routes (list by team)
app.use("/api/activities", require("./routes/activityRoutes"));
// Upload routes
app.use("/api/upload", require("./routes/uploadRoutes"));
// Notification routes
app.use("/api/notifications", require("./routes/notificationRoutes"));
// Analytics routes
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Hira API!" });
});

// Global error handler
app.use(errorHandler);

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hira";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    // Start the server only after DB connection is successful
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
