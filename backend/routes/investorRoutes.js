const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getInvestorDashboard,
  getInvestorProfile,
  updateInvestorProfile,
} = require("../controllers/investorController");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("investor"),
  getInvestorDashboard
);

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("investor"),
  getInvestorProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("investor"),
  updateInvestorProfile
);

module.exports = router;