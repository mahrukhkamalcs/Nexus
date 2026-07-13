const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  updateDealStatus,
} = require("../controllers/dealController");

// Investor creates a deal
router.post(
  "/",
  authMiddleware,
  roleMiddleware("investor"),
  createDeal
);

// Get all deals
router.get(
  "/",
  authMiddleware,
  getDeals
);

// Get one deal
router.get(
  "/:id",
  authMiddleware,
  getDeal
);

// Update deal
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("investor"),
  updateDeal
);

// Update status
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("investor"),
  updateDealStatus
);

// Delete deal
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("investor"),
  deleteDeal
);

module.exports = router;