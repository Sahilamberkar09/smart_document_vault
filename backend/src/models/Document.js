import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "General",
  },
  fileUrl: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  textContent: {
    type: String,
  },
  extractedText: {
    type: String,
  },
  // Add these new fields
  mimeType: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  originalFileName: {
    type: String,
  },
});

export default mongoose.model("Document", documentSchema);
