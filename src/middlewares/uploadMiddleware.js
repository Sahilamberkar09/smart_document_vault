import multer from "multer";

// Store files temporary in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Create a proper RegExp object with the allowed file extensions
    const allowedTypes = /\.(jpeg|jpg|png|gif|pdf|doc|docx)$/i;

    // Test the file extension
    const extname = allowedTypes.test(file.originalname.toLowerCase());

    // Define allowed MIME types
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export default upload;
