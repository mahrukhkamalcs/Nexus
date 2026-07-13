const User = require("../models/User");

// ==============================
// Entrepreneur Dashboard
// ==============================
const entrepreneurDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // Get recommended investors
    const investors = await User.find({ role: "investor" }).select("-password");

    res.status(200).json({
      success: true,
      message: "Entrepreneur Dashboard Loaded",
      user,
      summary: {
        pendingRequests: 0,
        totalConnections: 0,
        upcomingMeetings: 0,
        profileViews: 0
      },
      recommendedInvestors: investors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==============================
// Investor Dashboard
// ==============================
const investorDashboard = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    // Get all entrepreneurs
    const entrepreneurs = await User.find({
      role: "entrepreneur"
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Investor Dashboard Loaded",
      user,
      summary: {
        totalStartups: entrepreneurs.length,
        industries: 0,
        totalConnections: 0
      },
      entrepreneurs
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  entrepreneurDashboard,
  investorDashboard
};