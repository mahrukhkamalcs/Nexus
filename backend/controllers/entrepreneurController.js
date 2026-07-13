const User = require("../models/User");

// Get Entrepreneur Dashboard
exports.getEntrepreneurDashboard = async (req, res) => {
  try {
    const entrepreneur = await User.findById(req.user.id).select("-password");

    if (!entrepreneur) {
      return res.status(404).json({
        success: false,
        message: "Entrepreneur not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Entrepreneur dashboard fetched successfully",
      data: entrepreneur,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Entrepreneur Profile
exports.getEntrepreneurProfile = async (req, res) => {
  try {
    const entrepreneur = await User.findById(req.user.id).select("-password");

    if (!entrepreneur) {
      return res.status(404).json({
        success: false,
        message: "Entrepreneur not found",
      });
    }

    res.status(200).json({
      success: true,
      data: entrepreneur,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Entrepreneur Profile
exports.updateEntrepreneurProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const entrepreneur = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        bio,
        avatarUrl,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: entrepreneur,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};