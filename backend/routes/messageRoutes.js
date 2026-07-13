const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  getMyMessages,
  markAsRead,
} = require("../controllers/messageController");


// ================================
// Send Message
// ================================
router.post(
  "/",
  authMiddleware,
  sendMessage
);


// ================================
// Get All My Messages
// ================================
router.get(
  "/",
  authMiddleware,
  getMyMessages
);


// ================================
// Conversation Between Two Users
// ================================
router.get(
  "/:receiverId",
  authMiddleware,
  getConversation
);


// ================================
// Mark Message as Read
// ================================
router.put(
  "/read/:id",
  authMiddleware,
  markAsRead
);

module.exports = router;