import React, { useState } from "react";
import { uploadDocument } from "../utils/api";
import { useToast } from "../context/ToastContext";
import { FaCloudUploadAlt, FaTimes, FaSpinner } from "react-icons/fa";

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return addToast("Please select a file", "error");

    const formData = new FormData();
    formData.append("file", file);
    // Category is now determined automatically by the backend

    setLoading(true);
    try {
      await uploadDocument(formData);
      addToast("Document uploaded and categorized successfully", "success");
      onUploadSuccess();
      onClose();
    } catch (error) {
      addToast("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Upload Document
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                file
                  ? "border-primary bg-blue-50"
                  : "border-gray-300 hover:border-primary hover:bg-gray-50"
              }`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FaCloudUploadAlt
                  className={`text-4xl mb-3 ${
                    file ? "text-primary" : "text-gray-400"
                  }`}
                />
                <span className="text-sm text-gray-600 font-medium">
                  {file ? file.name : "Click to browse or drag file here"}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Supports PDF, Images, Text
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
