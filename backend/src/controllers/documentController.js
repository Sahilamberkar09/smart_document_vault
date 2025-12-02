import Document from "../models/Document.js";
import { extractText } from "../utils/ocr.js";
import { categorizeDocument } from "../utils/categorize.js";

/**
 * Uploads a document, performs OCR, runs automatic categorization, and saves metadata.
 */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title } = req.body;
    const userId = req.user._id;
    const fileUrl = req.file.path;

    // 1. Perform OCR
    console.log("Processing document...");
    const extractedText = await extractText(fileUrl);

    // 2. Use Keyword Matching to categorize
    console.log("Categorizing document...");
    const category = await categorizeDocument(extractedText);

    // 3. Save to Database
    const newDocument = new Document({
      user: userId,
      title: title || req.file.originalname,
      fileUrl: fileUrl,
      category: category,
      extractedText: extractedText,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      originalFileName: req.file.originalname,
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
    const documents = await Document.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(documents);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Get a single document
 */
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Get Document Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Update document metadata (title, etc)
 */
export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    document.title = req.body.title || document.title;
    document.category = req.body.category || document.category;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    console.error("Update Error:", error);
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

    if (document.user.toString() !== req.user._id.toString()) {
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
 * Re-categorize a document
 */
export const reCategorizeDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let textToAnalyze = document.extractedText;

    if (!textToAnalyze && document.fileUrl) {
      console.log("No extracted text found. Attempting OCR on file URL...");
      textToAnalyze = await extractText(document.fileUrl);
      if (textToAnalyze) {
        document.extractedText = textToAnalyze;
      }
    }

    if (!textToAnalyze) {
      return res.status(400).json({ message: "Could not extract text." });
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
    res.status(500).json({ message: "Server Error" });
  }
};
