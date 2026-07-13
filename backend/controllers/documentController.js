const Document = require("../models/Document");

exports.uploadDocument = async (req, res) => {
  try {
    const document = await Document.create({
      name: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find()
      .populate("uploadedBy", "name email");

    res.json(docs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc)
      return res.status(404).json({
        message: "Document not found",
      });

    res.json(doc);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);

    res.json({
      message: "Document deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.shareDocument = async (req, res) => {
  try {
    const { userId } = req.body;

    const doc = await Document.findById(req.params.id);

    doc.sharedWith.push(userId);

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.addSignature = async (req, res) => {
  try {
    const { signature } = req.body;

    const doc = await Document.findById(req.params.id);

    doc.signature = signature;

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};