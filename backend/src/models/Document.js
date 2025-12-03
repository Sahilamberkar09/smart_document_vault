import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true, // Needed for Cloudinary deletion
    },
    fileType: {
      type: String, // 'application/pdf', 'image/jpeg', etc.
      required: true,
    },
    originalName: {
      type: String, // Keep original filename for reference
    },
    fileSize: {
      type: Number, // Store size in bytes
    },
    category: {
      type: String,
      default: "Uncategorized",
      enum: [
        "Invoice",
        "Receipt",
        "Prescription",
        "Report",
        "Contract",
        "Uncategorized",
        "Other",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    ocrText: {
      type: String, // Extracted text content
      default: "",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add index for search performance
documentSchema.index({ title: "text", ocrText: "text", tags: "text" });

export default mongoose.model("Document", documentSchema);
