const Deal = require("../models/Deal");

// Create Deal
exports.createDeal = async (req, res) => {
  try {
    const deal = await Deal.create(req.body);

    res.status(201).json({
      success: true,
      deal,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Deals
exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find()
      .populate("investor", "name email")
      .populate("entrepreneur", "name email");

    res.json({
      success: true,
      count: deals.length,
      deals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Deal
exports.getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate("investor", "name email")
      .populate("entrepreneur", "name email");

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    res.json({
      success: true,
      deal,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Deal
exports.updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    res.json({
      success: true,
      deal,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Deal
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    await deal.deleteOne();

    res.json({
      success: true,
      message: "Deal deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Deal Status
exports.updateDealStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    deal.status = status;
    deal.lastActivity = new Date();

    await deal.save();

    res.json({
      success: true,
      deal,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};