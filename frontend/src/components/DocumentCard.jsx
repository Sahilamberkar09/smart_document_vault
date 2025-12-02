import React from "react";
import { Calendar, RefreshCw, Trash2, FileText } from "lucide-react";

const DocumentCard = ({ doc, onDelete, onReprocess }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full overflow-hidden hover:-translate-y-1">
      {/* Preview Header */}
      <div className="h-40 bg-gray-100 relative overflow-hidden">
        {doc.mimeType?.startsWith("image") ? (
          <img
            src={doc.fileUrl}
            alt={doc.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
            <FileText className="w-16 h-16" />
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transform hover:scale-105 transition"
          >
            View File
          </a>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
              doc.category === "Passport"
                ? "bg-purple-100/90 text-purple-700"
                : doc.category === "Invoice"
                ? "bg-emerald-100/90 text-emerald-700"
                : "bg-white/90 text-gray-700"
            }`}
          >
            {doc.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-medium">
          <Calendar className="w-3 h-3" />
          {new Date(doc.createdAt).toLocaleDateString()}
        </div>

        <h3
          className="font-bold text-gray-800 mb-1 truncate text-lg"
          title={doc.title}
        >
          {doc.title}
        </h3>

        <p className="text-xs text-gray-400 mb-4">
          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB •{" "}
          {doc.mimeType?.split("/")[1]?.toUpperCase()}
        </p>

        {/* Removed extracted text preview as requested */}

        {/* Actions */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
          <button
            onClick={() => onReprocess(doc._id)}
            className="text-gray-400 hover:text-indigo-600 transition flex items-center gap-1 text-xs font-medium"
            title="Re-run OCR"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reprocess</span>
          </button>
          <button
            onClick={() => onDelete(doc._id)}
            className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
