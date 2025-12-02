import React from "react";
import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaTrash,
  FaDownload,
  FaEye,
} from "react-icons/fa";

const DocumentCard = ({ document, onDelete }) => {
  const { title, fileType, createdAt, fileUrl, size } = document;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const isImage = fileType.startsWith("image/");

  const getFileIcon = () => {
    if (fileType.includes("pdf"))
      return <FaFilePdf className="text-red-500 text-4xl" />;
    if (fileType.includes("image"))
      return <FaFileImage className="text-purple-500 text-4xl" />;
    return <FaFileAlt className="text-gray-500 text-4xl" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full group">
      {/* Preview Section */}
      <div className="h-48 w-full bg-gray-50 relative border-b border-gray-100 group-hover:bg-gray-100 transition-colors">
        {isImage ? (
          <img
            src={fileUrl}
            alt={title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            {getFileIcon()}
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {fileType.split("/")[1] || "File"}
            </span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[1px]">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full text-gray-700 hover:text-primary hover:scale-110 transition-transform shadow-lg"
            title="View"
          >
            <FaEye />
          </a>
          <a
            href={fileUrl}
            download
            className="p-3 bg-white rounded-full text-gray-700 hover:text-primary hover:scale-110 transition-transform shadow-lg"
            title="Download"
          >
            <FaDownload />
          </a>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-semibold text-gray-800 truncate pr-2 flex-1"
            title={title}
          >
            {title}
          </h3>
          <button
            onClick={() => onDelete(document._id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-col gap-1">
            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium w-fit">
              {formatSize(size || 0)}
            </span>
          </div>
          <span className="font-medium">{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
