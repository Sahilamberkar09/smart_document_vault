import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import Document from "../models/Document.js";
import { extractTextFromImage } from "../utils/ocr.js";
import { categorizeDocument } from "../utils/categorize.js";

// Helper to handle OCR logic
const performOCR = async (fileUrl, mimeType) => {
  if (mimeType && mimeType.startsWith("image/")) {
    try {
      const text = await extractTextFromImage(fileUrl);
      return text || "";
    } catch (error) {
      console.error("OCR Processing failed:", error);
      return "";
    }
  }
  return ""; // Skip OCR for non-images (like PDFs) for now
};

// @desc    Upload Document with OCR and Auto-Categorization
// @route   POST /api/document/upload
// @access  Private
export const uploadDocument = asyncHandler(async (req, res) => {
  const { title, category, expiryDate } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    let fileUrl;

    // Upload to Cloudinary
    if (req.file.buffer) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "smart-vault" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      fileUrl = uploadResult.secure_url;
    } else if (req.file.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "smart-vault",
      });
      fileUrl = uploadResult.secure_url;
    } else {
      throw new Error("Invalid file format");
    }

    // Process OCR
    const extractedText = await performOCR(fileUrl, req.file.mimetype);

    // Auto Categorize
    let finalCategory = category;
    if (!finalCategory || finalCategory === "General") {
      finalCategory = categorizeDocument(extractedText);
    }

    const doc = await Document.create({
      userId: req.user._id,
      title: title || req.file.originalname,
      category: finalCategory || "General",
      fileUrl,
      extractedText,
      expiryDate: expiryDate || null,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// @desc    Re-process document with OCR
// @route   PATCH /api/document/:id/reprocess
// @access  Private
export const reprocessDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  if (doc.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const extractedText = await performOCR(doc.fileUrl, doc.mimeType);
  const newCategory = categorizeDocument(extractedText);

  doc.extractedText = extractedText;
  doc.category = newCategory;
  doc.updatedAt = Date.now();

  await doc.save();

  res.json({ message: "Reprocessed successfully", doc });
});

// @desc    Get all Documents for user
// @route   GET /api/document
// @access  Private
export const getDocuments = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let filter = { userId: req.user._id };

  if (category && category !== "All") {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { extractedText: { $regex: search, $options: "i" } },
    ];
  }

  const documents = await Document.find(filter).sort({ createdAt: -1 });
  res.json(documents);
});

// @desc    Get single document
// @route   GET /api/document/:id
// @access  Private
export const getDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc || doc.userId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.json(doc);
});

// @desc    Update document metadata
// @route   PUT /api/document/:id
// @access  Private
export const updateDocument = asyncHandler(async (req, res) => {
  const { title, category } = req.body;
  const doc = await Document.findById(req.params.id);

  if (!doc || doc.userId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Document not found" });
  }

  doc.title = title || doc.title;
  doc.category = category || doc.category;
  await doc.save();

  res.json(doc);
});

// @desc    Delete document
// @route   DELETE /api/document/:id
// @access  Private
export const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc || doc.userId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Document not found" });
  }

  // Cleanup Cloudinary
  if (doc.fileUrl) {
    try {
      const publicId = doc.fileUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`smart-vault/${publicId}`);
    } catch (err) {
      console.error("Cloudinary delete error:", err);
    }
  }

  await doc.deleteOne();
  res.json({ message: "Document removed" });
});
