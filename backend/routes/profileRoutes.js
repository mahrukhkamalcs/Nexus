const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("investor", "entrepreneur"),
  (req, res) => {
    res.json({
      message: "User Profile",
      user: req.user,
    });
  }
);

module.exports = router;