const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
  shareDocument,
  addSignature,
} = require("../controllers/documentController");

router.get("/", authMiddleware, getDocuments);

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

router.get("/:id", authMiddleware, downloadDocument);

router.delete("/:id", authMiddleware, deleteDocument);

router.put("/:id/share", authMiddleware, shareDocument);

router.put("/:id/signature", authMiddleware, addSignature);

module.exports = router;