import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "smart_document_vault",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    // resource_type: "auto" allows pdfs and images
    resource_type: "auto",
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;
