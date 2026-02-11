import React, { useState } from "react";
import { X, Upload, File as FileIcon } from "lucide-react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      addToast("Please select a file and enter a title", "error");
      return;
    }

    // --- KEY FIX STARTS HERE ---
    // 1. Create a FormData instance
    const formData = new FormData();

    // 2. Append fields exactly as the backend expects them
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);

    setLoading(true);

    try {
      // 3. Send the formData directly.
      // Do NOT set 'Content-Type': 'multipart/form-data' manually.
      // Do NOT send a plain object like { file, title }.
      const response = await api.post("/document/upload", formData);

      addToast("Document uploaded successfully", "success");

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      // Reset form
      setFile(null);
      setTitle("");
      setCategory("Personal");
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      const errorMessage =
        error.response?.data?.message || "Failed to upload document";
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-gray-900">Upload Document</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Document Title
            </label>
            <input
              type="text"
              className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g., Insurance Policy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">File</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-indigo-600">
                  <FileIcon className="w-5 h-5" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="text-indigo-600 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-400">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file || !title}
              className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
