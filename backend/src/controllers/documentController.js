import Document from "../models/Document.js";
import { extractText } from "../utils/ocr.js";
import { categorizeDocument } from "../utils/categorize.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * Uploads a document, performs OCR, runs AI categorization, and saves metadata.
 */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description } = req.body;
    const userId = req.user.id; // Assuming authMiddleware adds user to req
    const filePath = req.file.path;

    // 1. Perform OCR to get text
    console.log("Processing document...");
    const extractedText = await extractText(filePath);

    // 2. Use AI to categorize the document based on the text
    console.log("Categorizing document...");
    const category = await categorizeDocument(extractedText);

    // 3. Upload to Cloudinary (if not using cloud storage middleware directly)
    // If using multer-storage-cloudinary, req.file.path is already the Cloudinary URL
    // But typically OCR needs a local path or a readable URL.
    // If req.file.path is a URL, Tesseract handles it.

    // For this implementation, we assume req.file has the Cloudinary info or local path
    // If it's stored locally first:
    /*
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "documents",
    });
    const fileUrl = result.secure_url;
    // fs.unlinkSync(filePath); // Cleanup local file
    */

    // Assuming middleware handled cloud upload and gave us a path/url
    const fileUrl = req.file.path;

    // 4. Save to Database
    const newDocument = new Document({
      user: userId,
      title: title || req.file.originalname,
      description,
      fileUrl: fileUrl,
      category: category,
      extractedText: extractedText, // Optional: store text for search
      fileType: req.file.mimetype,
      size: req.file.size,
    });

    const savedDocument = await newDocument.save();

    res.status(201).json({
      message: "Document uploaded and processed successfully",
      document: savedDocument,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Get all documents for the logged-in user
 */
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(documents);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check user ownership
    if (document.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await document.deleteOne();
    res.status(200).json({ message: "Document removed" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Re-categorize a document using AI (for existing documents)
 */
export const reCategorizeDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check user ownership
    if (document.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    console.log(`Re-categorizing document: ${document.title}`);

    // If we have extracted text, use it. Otherwise, try to extract from the file URL.
    let textToAnalyze = document.extractedText;

    if (!textToAnalyze && document.fileUrl) {
      console.log("No extracted text found. Attempting OCR on file URL...");
      // Tesseract.js accepts URLs
      textToAnalyze = await extractText(document.fileUrl);

      // Update the document with the extracted text if found
      if (textToAnalyze) {
        document.extractedText = textToAnalyze;
      }
    }

    if (!textToAnalyze) {
      return res
        .status(400)
        .json({ message: "Could not extract text for categorization." });
    }

    const newCategory = await categorizeDocument(textToAnalyze);

    document.category = newCategory;
    await document.save();

    res.status(200).json({
      message: "Document re-categorized successfully",
      category: newCategory,
      document: document,
    });
  } catch (error) {
    console.error("Re-categorize Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
