const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  entrepreneurDashboard,
  investorDashboard
} = require("../controllers/dashboardController");

// ================================
// Entrepreneur Dashboard
// ================================
router.get(
  "/entrepreneur",
  authMiddleware,
  roleMiddleware("entrepreneur"),
  entrepreneurDashboard
);

// ================================
// Investor Dashboard
// ================================
router.get(
  "/investor",
  authMiddleware,
  roleMiddleware("investor"),
  investorDashboard
);

module.exports = router;