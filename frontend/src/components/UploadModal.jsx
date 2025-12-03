import { useState, useRef } from "react";
import { X, Upload, FileText } from "lucide-react";
import api from "../api/client.js";
import { useToast } from "../context/ToastContext.jsx";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // FIX 1: Use 'addToast' to match the context definition
  const { addToast } = useToast();

  const categories = [
    "Invoice",
    "Receipt",
    "Prescription",
    "Report",
    "Contract",
    "Uncategorized",
    "Other",
  ];

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // FIX 2: Updated function name
        addToast("File size too large (max 5MB)", "error");
        return;
      }
      setFile(file);
      if (!title) {
        setTitle(file.name.split(".")[0]);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      // FIX 3: Updated function name
      addToast("Please select a file and provide a title", "error");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", title);
    formData.append("category", category);

    setUploading(true);

    try {
      await api.post("/document/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // FIX 4: Updated function name
      addToast("Document uploaded successfully!", "success");

      if (onUploadSuccess) {
        onUploadSuccess(); // This unmounts the modal
      }

      // FIX 5: Removed handleClose() and finally block here
      // Reason: The modal is already unmounted by onUploadSuccess,
      // so we shouldn't try to update state (setUploading) afterwards.
    } catch (error) {
      console.error("Upload failed", error);
      // FIX 6: Updated function name
      addToast(error.response?.data?.message || "Upload failed", "error");
      setUploading(false); // Only stop loading if upload FAILED and modal is still open
    }
  };

  const handleClose = () => {
    setFile(null);
    setTitle("");
    setCategory("Uncategorized");
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Upload Document</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. March Electricity Bill"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }
              ${file ? "bg-green-50 border-green-200" : ""}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center animate-bounce-short">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <FileText size={24} />
                </div>
                <p className="text-sm font-semibold text-green-700 truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-3 text-xs text-red-500 hover:text-red-700 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, JPG, PNG (Max 5MB)
                </p>
              </>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !file || !title}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2
              ${
                uploading || !file || !title
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }
            `}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
