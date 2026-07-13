const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// Get all notifications of logged in user
router.get("/", authMiddleware, getNotifications);

// Get single notification
router.get("/:id", authMiddleware, getNotification);

// Create notification
router.post("/", authMiddleware, createNotification);

// Mark one notification as read
router.put("/:id/read", authMiddleware, markAsRead);

// Mark all notifications as read
router.put("/read/all", authMiddleware, markAllAsRead);

// Delete notification
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;