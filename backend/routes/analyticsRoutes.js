const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Team = require("../models/Team");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

router.use(protect);

// ---- GET /api/analytics/dashboard ----
router.get("/dashboard", asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find teams the user is in
  const teams = await Team.find({
    $or: [{ members: userId }, { "members.user": userId }]
  });
  
  const teamIds = teams.map(t => t._id);

  // Get tasks across these teams
  const tasks = await Task.find({ team: { $in: teamIds } })
    .populate("assignedTo", "name email")
    .populate("team", "name");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const myTasks = tasks.filter(t => {
    const assignedId = t.assignedTo?._id ? t.assignedTo._id.toString() : t.assignedTo?.toString();
    return assignedId === userId.toString();
  });

  // Stats
  const totalTeams = teams.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const pendingTasks = totalTasks - completedTasks;

  // Due today
  const dueToday = myTasks.filter(t => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline);
    return d >= today && d < new Date(today.getTime() + 24 * 60 * 60 * 1000) && t.status !== "done";
  });

  // Overdue
  const overdue = myTasks.filter(t => {
    if (!t.deadline) return false;
    return new Date(t.deadline) < today && t.status !== "done";
  });

  // Upcoming
  const upcoming = myTasks.filter(t => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline);
    return d >= today && d <= nextWeek && t.status !== "done";
  });

  res.json({
    stats: {
      totalTeams,
      totalTasks,
      completedTasks,
      pendingTasks
    },
    dueToday,
    overdue,
    upcoming
  });
}));

// ---- GET /api/analytics/team/:teamId ----
router.get("/team/:teamId", asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId).populate("members.user", "name email");
  if (!team) return res.status(404).json({ message: "Team not found" });

  const isMember = team.members.some(m => m.user?.toString() === req.user._id.toString() || m.toString() === req.user._id.toString());
  if (!isMember) {
    return res.status(403).json({ message: "Not a member" });
  }

  const tasks = await Task.find({ team: teamId }).populate("assignedTo", "name email");

  // Status breakdown
  const statusCounts = {
    todo: tasks.filter(t => t.status === "todo").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    review: tasks.filter(t => t.status === "review").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  // Member contributions
  const memberStats = {};
  team.members.forEach(m => {
    const userObj = m.user || m; // Handle mixed schema
    if (userObj.name) {
      memberStats[userObj.name] = 0;
    }
  });

  tasks.forEach(t => {
    if (t.status === "done" && t.assignedTo?.name) {
      memberStats[t.assignedTo.name] = (memberStats[t.assignedTo.name] || 0) + 1;
    }
  });

  const memberContributions = Object.keys(memberStats).map(name => ({
    name,
    completed: memberStats[name]
  }));

  res.json({
    statusCounts,
    memberContributions,
    totalTasks: tasks.length
  });
}));

module.exports = router;
