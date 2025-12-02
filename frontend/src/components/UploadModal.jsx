import { useState, useRef } from "react";
import { CheckCircle, Upload, Tag, Loader2, X } from "lucide-react";
import { apiRequest } from "../utils/api";
import { useToast } from "../context/ToastContext";

const UploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);

    try {
      await apiRequest("/document/upload", "POST", formData, true);
      addToast("Document uploaded successfully", "success");
      onSuccess();
    } catch (err) {
      addToast(err.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer group ${
              file
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
            }`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center text-indigo-600 animate-in fade-in zoom-in">
                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="font-semibold text-lg">{file.name}</p>
                <p className="text-sm text-indigo-400 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-4 text-xs text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="text-gray-500 group-hover:text-indigo-500 transition-colors">
                <div className="bg-gray-100 group-hover:bg-white p-4 rounded-full inline-block mb-4 transition-colors">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-semibold text-lg text-gray-700">
                  Click or drag file to upload
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports JPG, PNG (OCR enabled) & PDF
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category (Optional)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Auto Detect</option>
                <option value="Passport">Passport</option>
                <option value="Invoice">Invoice</option>
                <option value="Licence">Licence</option>
                <option value="Medical">Medical</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Start Upload & Process"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
