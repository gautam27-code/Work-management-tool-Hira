// Message Routes
// POST   /api/messages           → Send a message in a team
// GET    /api/messages/:teamId   → Get all messages for a team

const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Team = require("../models/Team");
const { protect } = require("../middleware/authMiddleware");

// All message routes require authentication
router.use(protect);

// ---- POST /api/messages ----
// Send a message in a team chat
router.post("/", async (req, res) => {
  try {
    const { teamId, text } = req.body;

    if (!teamId || !text || !text.trim()) {
      return res.status(400).json({ message: "Team ID and message text are required" });
    }

    // Verify the user is a member of this team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    // Create the message
    const message = await Message.create({
      team: teamId,
      sender: req.user._id,
      text: text.trim(),
    });

    // Populate sender info before sending back
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---- GET /api/messages/:teamId ----
// Get all messages for a specific team (sorted oldest first for chat)
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

    // Fetch all messages for this team, oldest first (chat order)
    const messages = await Message.find({ team: teamId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
