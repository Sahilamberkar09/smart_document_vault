import React from "react";
import { FileText, Trash2, Calendar, Eye } from "lucide-react";

const DocumentCard = ({ doc, onDelete }) => {
  // Helper to determine if file is an image based on MIME type
  // Safe use of optional chaining handled here
  const isImage = doc.fileType?.startsWith("image/");

  // Format date safely
  const formattedDate = new Date(doc.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = () => {
    onDelete(doc._id);
  };

  const getCategoryColor = (cat) => {
    const colors = {
      Invoice: "bg-yellow-50 text-yellow-700 border-yellow-100",
      Receipt: "bg-green-50 text-green-700 border-green-100",
      Contract: "bg-purple-50 text-purple-700 border-purple-100",
      Report: "bg-blue-50 text-blue-700 border-blue-100",
      Prescription: "bg-red-50 text-red-700 border-red-100",
      Uncategorized: "bg-gray-50 text-gray-600 border-gray-100",
    };
    return colors[cat] || colors["Uncategorized"];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      {/* Preview Area */}
      <div className="relative h-48 bg-gray-50 rounded-t-xl overflow-hidden flex items-center justify-center group-hover:bg-gray-100 transition-colors">
        {isImage ? (
          <img
            src={doc.fileUrl}
            alt={doc.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.innerHTML =
                '<div class="text-gray-400 flex flex-col items-center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span class="text-xs mt-2">Preview Unavailable</span></div>';
            }}
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
            <FileText size={56} strokeWidth={1.5} />

            {/* --- FIX APPLIED BELOW --- */}
            <span className="text-xs font-medium mt-2 uppercase tracking-wide text-gray-500">
              {doc.fileType ? doc.fileType.split("/")[1] : "DOC"}
            </span>
            {/* ------------------------- */}
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[1px]">
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white text-gray-700 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transform hover:scale-110 transition-all"
            title="View/Download"
          >
            <Eye size={18} />
          </a>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transform hover:scale-110 transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Category Badge */}
        <div
          className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full border shadow-sm uppercase tracking-wider ${getCategoryColor(
            doc.category
          )}`}
        >
          {doc.category || "Uncategorized"}
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="font-semibold text-gray-800 text-lg leading-tight truncate mb-1"
          title={doc.title}
        >
          {doc.title || "Untitled Document"}
        </h3>

        <div className="flex items-center text-xs text-gray-500 mb-4 space-x-2">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formattedDate}
          </span>
          <span>•</span>
          {/* Safe division in case fileSize is missing */}
          <span>{((doc.fileSize || 0) / 1024 / 1024).toFixed(2)} MB</span>
        </div>

        {/* Tags or Status (Optional) */}
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {doc.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {doc.tags.length > 2 && (
              <span className="text-[10px] text-gray-400">
                +{doc.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
