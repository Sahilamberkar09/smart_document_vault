import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import Document from "../models/Document.js";
import { extractTextFromImage } from "../utils/ocr.js";
import { categorizeDocument } from "../utils/categorize.js";
import { Readable } from "stream";

// @desc    Upload Document with OCR and Auto-Categorization
// @route   POST /api/documents/upload
// @access  Private

export const uploadDocument = asyncHandler(async (req, res) => {
  const { title, category, expiryDate } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded..." });
  }

  try {
    let fileUrl;
    let tempFilePath;

    // Upload to Cloudinary
    if (req.file.buffer) {
      // Handle memory storage (buffer)
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          resource_type: "auto",
          folder: "smart-vault",
        }
      );
      fileUrl = uploadResult.secure_url;
      tempFilePath = uploadResult.secure_url; // Use Cloudinary URL for OCR
    } else if (req.file.path) {
      // Handle disk storage (local file path)
      tempFilePath = req.file.path;

      // Upload to Cloudinary from local path
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "smart-vault",
      });
      fileUrl = uploadResult.secure_url;
    } else {
      throw new Error("Invalid file format");
    }

    // Initialize variables for OCR results
    let extractedText = "";
    let autoCategory = category || "General";

    // Check if file is an image for OCR processing
    const isImage = req.file.mimetype.startsWith("image/");

    if (isImage) {
      try {
        // Run OCR on the uploaded image
        console.log("Running OCR on uploaded image...");
        extractedText = await extractTextFromImage(tempFilePath);

        if (extractedText && extractedText.trim()) {
          // Auto-categorize based on extracted text if no manual category provided
          if (!category) {
            autoCategory = categorizeDocument(extractedText);
            console.log(`Auto-categorized as: ${autoCategory}`);
          }
        }
      } catch (ocrError) {
        console.warn("OCR processing failed:", ocrError.message);
        // Continue without OCR if it fails
      }
    }

    // Create document in database
    const doc = await Document.create({
      userId: req.user._id,
      title: title || req.file.originalname || "Untitled Document",
      category: autoCategory,
      fileUrl,
      extractedText,
      expiryDate: expiryDate || null,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      doc: {
        ...doc.toObject(),
        ocrProcessed: isImage && extractedText.length > 0,
        autoCategorized: !category && autoCategory !== "General",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Error uploading document",
      error: error.message,
    });
  }
});

// @desc    Re-process document with OCR (for existing docs)
// @route   POST /api/documents/:id/reprocess
// @access  Private

export const reprocessDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  if (doc.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Check if document is an image
    const isImage = doc.mimeType && doc.mimeType.startsWith("image/");

    if (!isImage) {
      return res.status(400).json({
        message: "OCR processing is only available for image files",
      });
    }

    // Run OCR on the existing file
    const extractedText = await extractTextFromImage(doc.fileUrl);

    // Re-categorize if needed
    const autoCategory = categorizeDocument(extractedText);

    // Update document
    doc.extractedText = extractedText;
    doc.category = autoCategory;
    doc.updatedAt = new Date();

    await doc.save();

    res.json({
      message: "Document reprocessed successfully",
      doc,
      extractedText,
      newCategory: autoCategory,
    });
  } catch (error) {
    console.error("Reprocess error:", error);
    res.status(500).json({
      message: "Error reprocessing document",
      error: error.message,
    });
  }
});

// @desc    Get all Documents for user
// @route   GET /api/documents
// @access  Private

export const getDocuments = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  let filter = { userId: req.user._id };

  // Filter by category if provided
  if (category && category !== "all") {
    filter.category = category;
  }

  // Search in title or extracted text
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
// @route   GET /api/documents/:id
// @access  Private

export const getDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  if (doc.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json(doc);
});

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private

export const updateDocument = asyncHandler(async (req, res) => {
  const { title, category } = req.body;

  const doc = await Document.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  if (doc.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Update fields
  if (title) doc.title = title;
  if (category) doc.category = category;
  doc.updatedAt = new Date();

  await doc.save();
  res.json(doc);
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private

export const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  if (doc.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Optional: Delete from Cloudinary as well
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = doc.fileUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = `smart-vault/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (cloudinaryError) {
    console.warn("Failed to delete from Cloudinary:", cloudinaryError.message);
    // Continue with database deletion even if Cloudinary deletion fails
  }

  await doc.deleteOne();
  res.status(200).json({ message: "Document deleted successfully" });
});
