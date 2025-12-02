import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, File, Loader2, RefreshCw } from "lucide-react";
import StatCard from "../components/StatCard";
import DocumentCard from "../components/DocumentCard";
import UploadModal from "../components/UploadModal";
import { apiRequest } from "../utils/api";
import { useToast } from "../context/ToastContext";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stats, setStats] = useState({ total: 0, recent: 0, expiring: 0 });

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToast } = useToast();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Updated to handle pagination response structure
      const data = await apiRequest(
        `/document?category=${selectedCategory}&search=${searchTerm}&page=${page}&limit=9`
      );

      // If backend returns { documents, page, pages, total }
      if (data.documents) {
        setDocuments(data.documents);
        setTotalPages(data.pages);
      } else {
        // Fallback for older API structure
        setDocuments(data);
      }

      // Calculate simple stats (this would ideally come from a dedicated stats endpoint for accuracy with pagination)
      const now = new Date();
      const expiringCount = (data.documents || data).filter((doc) => {
        if (!doc.expiryDate) return false;
        const expiry = new Date(doc.expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 30;
      }).length;

      setStats({
        total: data.total || (data.documents || data).length,
        recent: (data.documents || data).length, // Just showing current view count for now
        expiring: expiringCount,
      });
    } catch (err) {
      addToast(err.message || "Failed to fetch documents", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, searchTerm, page]); // Re-fetch on page change

  const handleReprocess = async (id) => {
    try {
      await apiRequest(`/document/${id}/reprocess`, "PATCH");
      addToast("Document reprocessed successfully", "success");
      fetchDocuments();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;
    try {
      await apiRequest(`/document/${id}`, "DELETE");
      addToast("Document deleted", "success");
      fetchDocuments();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full space-y-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Upload New
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
            <p>Loading your documents...</p>
          </div>
        ) : documents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  doc={doc}
                  onReprocess={handleReprocess}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <File className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or filters."
                : "Upload your first document to get started with AI-powered extraction."}
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Upload a document now
            </button>
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            fetchDocuments();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
