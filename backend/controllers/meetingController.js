const Meeting = require("../models/Meeting");

// Schedule Meeting
// Schedule Meeting
exports.scheduleMeeting = async (req, res) => {
  try {
    const {
      entrepreneur,
      title,
      description,
      meetingDate,
      startTime,
      endTime,
      meetingLink,
    } = req.body;

    // Convert time strings (e.g., "14:30") to total minutes for proper evaluation
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Fetch any active meetings on the same date involving either participant
    const existingMeetings = await Meeting.find({
      meetingDate,
      status: { $ne: "Rejected" },
      $or: [
        { investor: req.user.id },
        { entrepreneur: req.user.id },
        { investor: entrepreneur },
        { entrepreneur: entrepreneur }
      ]
    });

    // Check for overlapping intervals
    for (let meeting of existingMeetings) {
      const currentStart = timeToMinutes(meeting.startTime);
      const currentEnd = timeToMinutes(meeting.endTime);

      // Overlap formula: New Start < Existing End AND New End > Existing Start
      if (newStart < currentEnd && newEnd > currentStart) {
        return res.status(409).json({
          success: false,
          message: "Schedule conflict detected! One of the participants is already booked during this timeframe.",
        });
      }
    }

    const meeting = await Meeting.create({
      investor: req.user.id,
      entrepreneur,
      title,
      description,
      meetingDate,
      startTime,
      endTime,
      meetingLink,
    });

    res.status(201).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Investor Meetings
exports.getInvestorMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      investor: req.user.id,
    })
      .populate("entrepreneur", "name email")
      .sort({ meetingDate: 1 });

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Entrepreneur Meetings
exports.getEntrepreneurMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      entrepreneur: req.user.id,
    })
      .populate("investor", "name email")
      .sort({ meetingDate: 1 });

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Accept Meeting
exports.acceptMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    meeting.status = "Accepted";

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting accepted",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject Meeting
exports.rejectMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    meeting.status = "Rejected";

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting rejected",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    await meeting.deleteOne();

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};