// POST   /api/tasks      → Create a new task
// GET    /api/tasks      → Get all tasks
// PUT    /api/tasks/:id  → Update a task (progress, completed, etc.)

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// ---- POST /api/tasks ----
// Create a new task
router.post("/", async (req, res) => {
  try {
    // Get task data from request body
    const { title, description, deadline, progress } = req.body;

    // Create a new task in the database
    const newTask = await Task.create({
      title,
      description,
      deadline,
      progress: progress || 0,
      completed: false,
    });

    // Send back status 201 (Created)
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---- GET /api/tasks ----
// Get all tasks (sorted by newest first)
router.get("/", async (req, res) => {
  try {
    // Fetch all tasks, newest first
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---- PUT /api/tasks/:id ----
// change progress or mark as completed)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // { new: true } returns the updated document
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // task not found
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send updated task
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
