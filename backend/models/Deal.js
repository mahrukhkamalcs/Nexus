const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    startupName: {
      type: String,
      required: true,
    },

    startupLogo: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      required: true,
    },

    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    equity: {
      type: Number,
      required: true,
    },

    stage: {
      type: String,
      enum: [
        "Pre-seed",
        "Seed",
        "Series A",
        "Series B",
        "Series C",
      ],
      default: "Seed",
    },

    status: {
      type: String,
      enum: [
        "Due Diligence",
        "Negotiation",
        "Term Sheet",
        "Closed",
        "Passed",
      ],
      default: "Negotiation",
    },

    notes: {
      type: String,
      default: "",
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Deal", dealSchema);