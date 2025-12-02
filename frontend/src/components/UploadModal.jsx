import React, { useState } from "react";
import { uploadDocument } from "../utils/api";
import { useToast } from "../context/ToastContext";
import { FaCloudUploadAlt, FaTimes, FaSpinner } from "react-icons/fa";

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Uncategorized");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return showToast("Please select a file", "error");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    setLoading(true);
    try {
      await uploadDocument(formData);
      showToast("Document uploaded successfully", "success");
      onUploadSuccess();
      onClose();
    } catch (error) {
      showToast("Upload failed", "error");
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            >
              <option value="Uncategorized">Uncategorized</option>
              <option value="Finance">Finance</option>
              <option value="Legal">Legal</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
            </select>
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
