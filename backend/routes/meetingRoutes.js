const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Import controllers first before using them in the routes
const {
  scheduleMeeting,
  getInvestorMeetings,
  getEntrepreneurMeetings,
  acceptMeeting,
  rejectMeeting,
  deleteMeeting,
} = require("../controllers/meetingController");

// Investor schedules meeting
router.post(
  "/schedule",
  authMiddleware,
  roleMiddleware("investor"),
  scheduleMeeting
);

// Investor meetings
router.get(
  "/investor",
  authMiddleware,
  roleMiddleware("investor"),
  getInvestorMeetings
);

// Entrepreneur meetings
router.get(
  "/entrepreneur",
  authMiddleware,
  roleMiddleware("entrepreneur"),
  getEntrepreneurMeetings
);

// Entrepreneur accepts meeting
router.put(
  "/accept/:id",
  authMiddleware,
  roleMiddleware("entrepreneur"),
  acceptMeeting
);

// Entrepreneur rejects meeting
router.put(
  "/reject/:id",
  authMiddleware,
  roleMiddleware("entrepreneur"),
  rejectMeeting
);

// Delete meeting
router.delete(
  "/:id",
  authMiddleware,
  deleteMeeting
);

module.exports = router;