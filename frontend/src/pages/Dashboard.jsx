import React, { useState, useEffect } from "react";
import { getDocuments, deleteDocument } from "../utils/api";
import DocumentCard from "../components/DocumentCard";
import UploadModal from "../components/UploadModal";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  FaPlus,
  FaSearch,
  FaFileAlt,
  FaHdd,
  FaImage,
  FaSignOutAlt,
} from "react-icons/fa";
// no router hook here — App doesn't use react-router, so avoid useNavigate

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await getDocuments();
      // backend returns { documents, page, pages, total }
      // ensure we always set an array on state to avoid undefined
      const docs = (res && res.documents) || res || [];
      setDocuments(docs);
    } catch (error) {
      showToast("Failed to fetch documents", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
        setDocuments(documents.filter((doc) => doc._id !== id));
        showToast("Document deleted successfully", "success");
      } catch (error) {
        showToast("Failed to delete document", "error");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out", "success");
    } catch (err) {
      showToast("Logout failed", "error");
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats Logic
  const totalDocs = documents.length;
  const totalSize = documents.reduce((acc, doc) => acc + (doc.size || 0), 0);
  const imageDocs = documents.filter((doc) =>
    doc.fileType.startsWith("image")
  ).length;

  const formatTotalSize = (bytes) => {
    if (bytes === 0) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">DocVault</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-right">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Documents"
            value={totalDocs}
            icon={<FaFileAlt />}
            color="blue"
          />
          <StatCard
            title="Storage Used"
            value={formatTotalSize(totalSize)}
            icon={<FaHdd />}
            color="purple"
          />
          <StatCard
            title="Images"
            value={imageDocs}
            icon={<FaImage />}
            color="green"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <FaPlus size={14} />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Content Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No documents found
            </h3>
            <p className="text-gray-500 mt-1">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Upload your first document to get started"}
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={fetchDocuments}
        />
      )}
    </div>
  );
};

export default Dashboard;
