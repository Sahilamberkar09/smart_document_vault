import express from "express";
import {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
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


// OPTIMIZED: Changed from DELETE to PATCH as this is an update operation
router.patch("/:id/reprocess", protect, reprocessDocument);

export default router;
