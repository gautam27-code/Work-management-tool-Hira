// Each task belongs to a team, is created by a user,
// and can be assigned to a specific team member.

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Title of the task (required)
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    // Optional description
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

    // Progress percentage (0-100)
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

    // Which team this task belongs to (required)
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Task must belong to a team"],
    },

    // Which user this task is assigned to (optional)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Who created this task
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;