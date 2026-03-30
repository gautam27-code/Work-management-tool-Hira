// ============================
// Task Routes (Team-Scoped)
// ============================
// POST   /api/tasks           → Create a new task (requires teamId)
// GET    /api/tasks/:teamId   → Get all tasks for a team
// PUT    /api/tasks/:id       → Update a task (progress, completed, assignedTo)

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Team = require("../models/Team");
const { protect } = require("../middleware/authMiddleware");

// All task routes require authentication
router.use(protect);

// ---- POST /api/tasks ----
// Create a new task inside a team
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline, progress, teamId, assignedTo } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required to create a task" });
    }

    // Verify the user is a member of this team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    // Create the task
    const newTask = await Task.create({
      title,
      description,
      deadline,
      progress: progress || 0,
      completed: false,
      team: teamId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    // Populate references before sending back
    const populatedTask = await Task.findById(newTask._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---- GET /api/tasks/:teamId ----
// Get all tasks for a specific team
router.get("/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;

    // Verify the user is a member of this team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    // Fetch all tasks for this team, newest first
    const tasks = await Task.find({ team: teamId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---- PUT /api/tasks/:id ----
// Update a task (progress, completed, assignedTo, etc.)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task first to check team membership
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify the user is a member of the task's team
    const team = await Team.findById(task.team);
    if (!team || !team.members.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
