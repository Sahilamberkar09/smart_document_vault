import express from "express";
import {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  reCategorizeDocument, // Fixed import name
} from "../controllers/documentController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Upload route
router.post("/upload", protect, upload.single("file"), uploadDocument);

// CRUD routes
router.get("/", protect, getDocuments);
router.get("/:id", protect, getDocument);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);

// Fixed: Route matches the imported controller name
router.patch("/:id/reprocess", protect, reCategorizeDocument);

export default router;
