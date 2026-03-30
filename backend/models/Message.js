// ============================
// Message Model
// ============================
// A chat message sent inside a team.
// Each message belongs to a team and has a sender.

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Which team this message belongs to
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    // Who sent this message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The message text
    text: {
      type: String,
      required: [true, "Message text is required"],
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
