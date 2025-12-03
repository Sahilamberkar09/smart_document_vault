import Document from "../models/Document.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
// Import the existing utilities
import { extractTextFromImage } from "../utils/ocr.js";
import { categorizeDocument } from "../utils/categorize.js";

// @desc    Upload a new document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, category, tags } = req.body;

    // 1. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "smart_doc_vault",
      resource_type: "auto",
      use_filename: true,
    });

    // 2. Perform OCR before deleting the local file
    // We try/catch this block specifically so OCR failure doesn't block the upload
    let ocrText = "";
    try {
      ocrText = await extractTextFromImage(req.file.path);
    } catch (err) {
      console.error("OCR Failed:", err);
    }

    // 3. Determine Category Automatically
    // If the user didn't pick a specific category (or left it as 'Uncategorized'),
    // we use the one derived from the OCR text.
    let finalCategory = category;
    if (!category || category === "Uncategorized") {
      finalCategory = categorizeDocument(ocrText);
    }

    // 4. Delete local file
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error("Error deleting local file:", err);
    }

    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
    }

    // 5. Create Document in DB
    const document = await Document.create({
      user: req.user._id,
      title: title || req.file.originalname,
      originalName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      category: finalCategory, // Uses the auto-detected category
      tags: parsedTags,
      ocrText: ocrText, // Saves the extracted text
    });

    res.status(201).json(document);
  } catch (error) {
    console.error("Upload error:", error);
    // Attempt to clean up file if main execution failed
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Error deleting file after failure:", unlinkErr);
      }
    }
    res.status(500).json({ message: "Server Error during upload" });
  }
};

// ... (Keep the rest of the existing controller functions: getDocuments, getDocument, etc. exactly as they were)
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, category, tags, isFavorite } = req.body;

    document.title = title || document.title;
    document.category = category || document.category;

    if (isFavorite !== undefined) {
      document.isFavorite = isFavorite;
    }

    if (tags) {
      document.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
    }

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId);
    }

    await document.deleteOne();

    res.json({ message: "Document removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const reprocessDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Since we now have real logic, we can also add it here:
    // 1. Download file from document.fileUrl (requires extra setup for FS)
    // OR just return the message as before since the file is already on Cloudinary
    // and Tesseract works best with local paths or public URLs.

    // For now, we keep the original response to avoid complexity with downloading files
    res.json({
      message: "Reprocessing logic to be implemented via background job",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
