const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const Team = require("../models/Team");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

router.use(protect);

// ---- GET /api/activities/:teamId ----
// Get all activities for a specific team
router.get("/:teamId", asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const isMember = team.members.some(m => m.toString() === req.user._id.toString() || (m.user && m.user.toString() === req.user._id.toString()));
  if (!isMember) {
    return res.status(403).json({ message: "You are not a member of this team" });
  }

  // Fetch recent activities (limit 50)
  const activities = await Activity.find({ team: teamId })
    .populate("user", "name email")
    .populate("task", "title")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(activities);
}));

module.exports = router;
