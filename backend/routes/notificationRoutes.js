const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

router.use(protect);

// ---- GET /api/notifications ----
router.get("/", asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
}));

// ---- GET /api/notifications/unread-count ----
router.get("/unread-count", asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ user: req.user._id, read: false });
  res.json({ count });
}));

// ---- PUT /api/notifications/:id/read ----
router.put("/:id/read", asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: "Not found" });
  res.json(notification);
}));

// ---- PUT /api/notifications/read-all ----
router.put("/read-all", asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: "All notifications marked as read" });
}));

module.exports = router;
