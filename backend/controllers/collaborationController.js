const CollaborationRequest = require("../models/CollaborationRequest");


// Create Request

exports.createRequest = async (req, res) => {
  try {

    const { entrepreneurId, message } = req.body;

    const request = await CollaborationRequest.create({
      investor: req.user.id,
      entrepreneur: entrepreneurId,
      message,
    });

    res.status(201).json(request);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};



// Requests received by Entrepreneur

exports.getEntrepreneurRequests = async (req, res) => {

  try {

    const requests = await CollaborationRequest.find({
      entrepreneur: req.user.id,
    })

      .populate("investor", "name email profileImage")

      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};




// Requests sent by Investor

exports.getInvestorRequests = async (req, res) => {

  try {

    const requests = await CollaborationRequest.find({
      investor: req.user.id,
    })

      .populate("entrepreneur", "name startupName")

      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};




// Accept Request

exports.acceptRequest = async (req, res) => {

  try {

    const request = await CollaborationRequest.findById(req.params.id);

    if (!request)

      return res.status(404).json({
        message: "Request not found",
      });

    request.status = "accepted";

    await request.save();

    res.json(request);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};




// Reject Request

exports.rejectRequest = async (req, res) => {

  try {

    const request = await CollaborationRequest.findById(req.params.id);

    if (!request)

      return res.status(404).json({
        message: "Request not found",
      });

    request.status = "rejected";

    await request.save();

    res.json(request);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};