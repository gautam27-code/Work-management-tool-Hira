// ============================
// Team Routes
// ============================
// POST   /api/teams        → Create a new team
// GET    /api/teams        → Get all teams of logged-in user
// POST   /api/teams/invite → Invite a user by email
// POST   /api/teams/join   → Join a team (if your email was invited)

const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// All team routes require authentication
router.use(protect);

// ---- POST /api/teams ----
// Create a new team. The creator becomes owner and first member.
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Team name is required" });
    }

    // Create the team with the logged-in user as owner and first member
    const team = await Team.create({
      name: name.trim(),
      owner: req.user._id,
      members: [req.user._id],
    });

    // Also add this team to the user's teams array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { teams: team._id },
    });

    // Populate owner and members before sending back
    const populatedTeam = await Team.findById(team._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---- GET /api/teams ----
// Get all teams that the logged-in user is a member of
router.get("/", async (req, res) => {
  try {
    // Find teams where the user is in the members array
    const teams = await Team.find({ members: req.user._id })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---- POST /api/teams/invite ----
// Invite a user to a team by their email address
// Body: { teamId, email }
router.post("/invite", async (req, res) => {
  try {
    const { teamId, email } = req.body;

    if (!teamId || !email) {
      return res.status(400).json({ message: "Team ID and email are required" });
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Only team members can invite others
    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    // Check if this email is already invited
    const normalizedEmail = email.trim().toLowerCase();
    if (team.inviteEmails.includes(normalizedEmail)) {
      return res.status(400).json({ message: "This email has already been invited" });
    }

    // Check if this user is already a member
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && team.members.includes(existingUser._id)) {
      return res.status(400).json({ message: "This user is already a team member" });
    }

    // Add email to the invite list
    team.inviteEmails.push(normalizedEmail);
    await team.save();

    res.json({ message: `Invitation sent to ${normalizedEmail}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---- POST /api/teams/join ----
// Join a team if the logged-in user's email is in the inviteEmails list
// Body: { teamId }
router.post("/join", async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is already a member
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already a member of this team" });
    }

    // Check if the user's email is in the invite list
    const userEmail = req.user.email.toLowerCase();
    if (!team.inviteEmails.includes(userEmail)) {
      return res.status(403).json({ message: "You have not been invited to this team" });
    }

    // Add user to team members
    team.members.push(req.user._id);

    // Remove the email from inviteEmails (they've joined now)
    team.inviteEmails = team.inviteEmails.filter((e) => e !== userEmail);
    await team.save();

    // Also add this team to the user's teams array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { teams: team._id },
    });

    // Return populated team
    const populatedTeam = await Team.findById(team._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---- GET /api/teams/pending ----
// Get all teams that have invited the logged-in user (so they can join)
router.get("/pending", async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();

    // Find teams where the user's email is in the inviteEmails array
    const teams = await Team.find({ inviteEmails: userEmail })
      .populate("owner", "name email")
      .select("name owner createdAt");

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
