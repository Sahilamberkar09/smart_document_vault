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
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    ocrText: {
      type: String,
      default: "", // Stores the text extracted during upload
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
