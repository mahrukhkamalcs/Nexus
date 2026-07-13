const User = require("../models/User");

// Get Investor Dashboard
exports.getInvestorDashboard = async (req, res) => {
  try {
    const investor = await User.findById(req.user.id).select("-password");

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Investor dashboard fetched successfully",
      data: investor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Investor Profile
exports.getInvestorProfile = async (req, res) => {
  try {
    const investor = await User.findById(req.user.id).select("-password");

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: investor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Investor Profile
exports.updateInvestorProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const investor = await User.findByIdAndUpdate(
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
      data: investor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};