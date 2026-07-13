const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getEntrepreneurDashboard,
  getEntrepreneurProfile,
  updateEntrepreneurProfile,
} = require("../controllers/entrepreneurController");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("entrepreneur"),
  getEntrepreneurDashboard
);

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("entrepreneur"),
  getEntrepreneurProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("entrepreneur"),
  updateEntrepreneurProfile
);

module.exports = router;