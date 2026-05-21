const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null, // Null if it's a general team activity
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g., 'created task', 'updated status', 'commented'
    },
    details: {
      type: String, // e.g., 'changed status from todo to in_progress'
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
