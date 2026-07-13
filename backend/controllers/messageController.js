const Message = require("../models/Message");


// ===================================
// Send Message
// POST /api/messages
// ===================================

const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;

    if (!receiver || !message) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message are required",
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ===================================
// Get Conversation
// GET /api/messages/:receiverId
// ===================================

const getConversation = async (req, res) => {
  try {

    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    const conversation = await Message.find({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: conversation.length,
      data: conversation,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ===================================
// Get All Conversations
// GET /api/messages
// ===================================

const getMyMessages = async (req, res) => {
  try {

    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ===================================
// Mark Message as Read
// PUT /api/messages/read/:id
// ===================================

const markAsRead = async (req, res) => {

  try {

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.isRead = true;

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



module.exports = {
  sendMessage,
  getConversation,
  getMyMessages,
  markAsRead,
};