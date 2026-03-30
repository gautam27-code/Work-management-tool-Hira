// Each task has a title, description, deadline, progress, and completed status.

const mongoose = require("mongoose");

// Define the schema (blueprint) for a Task
const taskSchema = new mongoose.Schema(
  {
    // Title of the task (required)
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    // Description of what the task involves
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Deadline for the task
    deadline: {
      type: Date,
      default: null,
    },

    // Progress percentage (0 to 100)
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Whether the task is completed
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create the model from the schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;