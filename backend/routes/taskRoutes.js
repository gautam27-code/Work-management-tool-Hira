// ============================
// Task Routes (Team-Scoped)
// ============================

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Team = require("../models/Team");
const Activity = require("../models/Activity");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

router.use(protect);

// Helper function to calculate progress
const calculateProgress = (subtasks) => {
  if (!subtasks || subtasks.length === 0) return 0;
  const completed = subtasks.filter(st => st.completed).length;
  return Math.round((completed / subtasks.length) * 100);
};

// ---- POST /api/tasks ----
router.post("/", asyncHandler(async (req, res) => {
  const { title, description, deadline, priority, status, subtasks, teamId, assignedTo } = req.body;

  if (!teamId) {
    return res.status(400).json({ message: "Team ID is required to create a task" });
  }
  
  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Only admins can create tasks
  const requester = team.members.find(m => m.user?.toString() === req.user._id.toString() || m.toString() === req.user._id.toString());
  if (!requester || requester.role !== "admin") {
    return res.status(403).json({ message: "Only team admins can create tasks" });
  }

  const progress = calculateProgress(subtasks);

  const newTask = await Task.create({
    title,
    description,
    deadline,
    priority: priority || "medium",
    status: status || "todo",
    subtasks: subtasks || [],
    progress: progress,
    team: teamId,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(newTask._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  // Log activity
  const activity = await Activity.create({
    team: teamId,
    task: newTask._id,
    user: req.user._id,
    action: "created task",
    details: `created task "${title}"`,
  });
  
  const populatedActivity = await Activity.findById(activity._id).populate("user", "name email");

  if (req.io) {
    req.io.to(teamId.toString()).emit("task:created", populatedTask);
    req.io.to(teamId.toString()).emit("activity:new", populatedActivity);
  }

  // Create notification if assigned to someone else
  if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
    const Notification = require("../models/Notification");
    const notification = await Notification.create({
      user: assignedTo,
      type: "task_assigned",
      text: `You were assigned a new task: "${title}"`,
      link: `/team/${teamId}`,
      relatedTask: newTask._id,
      relatedTeam: teamId,
    });
    if (req.io) {
      req.io.to(`user:${assignedTo.toString()}`).emit("notification:new", notification);
    }
  }

  res.status(201).json(populatedTask);
}));

// ---- GET /api/tasks/:teamId ----
router.get("/:teamId", asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { priority, status, sort } = req.query;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const isMember = team.members.some(m => m.toString() === req.user._id.toString() || (m.user && m.user.toString() === req.user._id.toString()));
  if (!isMember) {
    return res.status(403).json({ message: "You are not a member of this team" });
  }

  let filter = { team: teamId };
  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  let sortOption = { createdAt: -1 };
  if (sort === "priority") {
    sortOption = { priority: 1 };
  } else if (sort === "deadline") {
    sortOption = { deadline: 1 };
  } else if (sort === "status") {
    sortOption = { status: 1 };
  }

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort(sortOption);

  res.json(tasks);
}));

// ---- PUT /api/tasks/:id ----
router.put("/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  
  // Whitelist fields
  const allowedUpdates = ["title", "description", "deadline", "priority", "status", "assignedTo", "progress", "attachments"];
  Object.keys(updates).forEach(key => {
    if (!allowedUpdates.includes(key)) delete updates[key];
  });

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const team = await Team.findById(task.team);
  const requester = team && team.members.find(m => m.user?.toString() === req.user._id.toString() || m.toString() === req.user._id.toString());
  if (!requester) {
    return res.status(403).json({ message: "You are not a member of this team" });
  }

  // Members can only update tasks assigned to them. Admins can update any.
  if (requester.role !== "admin" && task.assignedTo?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only update tasks assigned to you" });
  }

  // Handle 'completed' backward compatibility from frontend
  if (req.body.completed !== undefined) {
    updates.status = req.body.completed ? 'done' : 'todo';
  }

  let action = "updated task";
  let details = `updated task "${task.title}"`;
  
  if (updates.status && updates.status !== task.status) {
    action = "updated status";
    details = `changed status of "${task.title}" to ${updates.status}`;
  } else if (updates.priority && updates.priority !== task.priority) {
    action = "updated priority";
    details = `changed priority of "${task.title}" to ${updates.priority}`;
  }

  const updatedTask = await Task.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  const activity = await Activity.create({
    team: task.team,
    task: task._id,
    user: req.user._id,
    action,
    details,
  });
  const populatedActivity = await Activity.findById(activity._id).populate("user", "name email");

  if (req.io) {
    req.io.to(task.team.toString()).emit("task:updated", updatedTask);
    req.io.to(task.team.toString()).emit("activity:new", populatedActivity);
  }

  // Create notification if newly assigned to someone else
  if (updates.assignedTo && updates.assignedTo.toString() !== task.assignedTo?.toString() && updates.assignedTo.toString() !== req.user._id.toString()) {
    const Notification = require("../models/Notification");
    const notification = await Notification.create({
      user: updates.assignedTo,
      type: "task_assigned",
      text: `You were assigned to a task: "${task.title}"`,
      link: `/team/${task.team}`,
      relatedTask: task._id,
      relatedTeam: task.team,
    });
    if (req.io) {
      req.io.to(`user:${updates.assignedTo.toString()}`).emit("notification:new", notification);
    }
  }

  res.json(updatedTask);
}));

// ---- DELETE /api/tasks/:id ----
router.delete("/:id", asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const team = await Team.findById(task.team);
  const requester = team && team.members.find(m => m.user?.toString() === req.user._id.toString() || m.toString() === req.user._id.toString());
  if (!requester || requester.role !== "admin") {
    return res.status(403).json({ message: "Only team admins can delete tasks" });
  }

  await task.deleteOne();

  const activity = await Activity.create({
    team: task.team,
    user: req.user._id,
    action: "deleted task",
    details: `deleted task "${task.title}"`,
  });
  const populatedActivity = await Activity.findById(activity._id).populate("user", "name email");

  if (req.io) {
    req.io.to(task.team.toString()).emit("task:deleted", task._id);
    req.io.to(task.team.toString()).emit("activity:new", populatedActivity);
  }

  res.json({ message: "Task removed" });
}));

// ---- POST /api/tasks/:id/subtasks ----
router.post("/:id/subtasks", asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Subtask title is required" });

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.subtasks.push({ title, completed: false });
  task.progress = calculateProgress(task.subtasks);
  
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  const activity = await Activity.create({
    team: task.team,
    task: task._id,
    user: req.user._id,
    action: "added subtask",
    details: `added subtask "${title}" to "${task.title}"`,
  });
  const populatedActivity = await Activity.findById(activity._id).populate("user", "name email");

  if (req.io) {
    req.io.to(task.team.toString()).emit("task:updated", updatedTask);
    req.io.to(task.team.toString()).emit("activity:new", populatedActivity);
  }

  res.status(201).json(updatedTask);
}));

// ---- PUT /api/tasks/:id/subtasks/:subtaskId ----
router.put("/:id/subtasks/:subtaskId", asyncHandler(async (req, res) => {
  const { completed } = req.body;
  
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const subtask = task.subtasks.id(req.params.subtaskId);
  if (!subtask) return res.status(404).json({ message: "Subtask not found" });

  if (completed !== undefined) subtask.completed = completed;
  
  task.progress = calculateProgress(task.subtasks);
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  const activity = await Activity.create({
    team: task.team,
    task: task._id,
    user: req.user._id,
    action: "updated subtask",
    details: `marked subtask "${subtask.title}" as ${completed ? 'completed' : 'incomplete'}`,
  });
  const populatedActivity = await Activity.findById(activity._id).populate("user", "name email");

  if (req.io) {
    req.io.to(task.team.toString()).emit("task:updated", updatedTask);
    req.io.to(task.team.toString()).emit("activity:new", populatedActivity);
  }

  res.json(updatedTask);
}));

// ---- DELETE /api/tasks/:id/subtasks/:subtaskId ----
router.delete("/:id/subtasks/:subtaskId", asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const subtaskTitle = task.subtasks.id(req.params.subtaskId)?.title || "a subtask";

  task.subtasks.pull(req.params.subtaskId);
  task.progress = calculateProgress(task.subtasks);
  
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  const activity = await Activity.create({
    team: task.team,
    task: task._id,
    user: req.user._id,
    action: "removed subtask",
    details: `removed subtask "${subtaskTitle}" from "${task.title}"`,
  });
  const populatedActivity = await Activity.findById(activity._id).populate("user", "name email");

  if (req.io) {
    req.io.to(task.team.toString()).emit("task:updated", updatedTask);
    req.io.to(task.team.toString()).emit("activity:new", populatedActivity);
  }

  res.json(updatedTask);
}));

module.exports = router;