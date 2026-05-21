const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const attachmentSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
  uploadedAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    deadline: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // New fields
    priority: { 
      type: String, 
      enum: ["low", "medium", "high", "critical"], 
      default: "medium" 
    },
    status: { 
      type: String, 
      enum: ["todo", "in_progress", "review", "done"], 
      default: "todo" 
    },
    subtasks: [subtaskSchema],
    attachments: [attachmentSchema],

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Task must belong to a team"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property for backward compatibility
taskSchema.virtual('completed').get(function() {
  return this.status === 'done';
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;