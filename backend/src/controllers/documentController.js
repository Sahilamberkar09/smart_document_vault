import Document from "../models/Document.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// @desc    Upload a new document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, category, tags } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "smart_doc_vault",
      resource_type: "auto",
      use_filename: true,
    });

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

    const document = await Document.create({
      user: req.user._id,
      title: title || req.file.originalname,
      originalName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      category: category || "Uncategorized",
      tags: parsedTags,
    });

    res.status(201).json(document);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server Error during upload" });
  }
};

// @desc    Get all documents for user
// @route   GET /api/documents
// @access  Private
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

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
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

// @desc    Update document details
// @route   PUT /api/documents/:id
// @access  Private
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

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
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

// @desc    Reprocess document (OCR stub)
// @route   PATCH /api/documents/:id/reprocess
// @access  Private
export const reprocessDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Placeholder for OCR logic
    // In a real app, this would trigger a background job
    res.json({ message: "Document queued for reprocessing" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
