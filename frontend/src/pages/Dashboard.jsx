import { useState, useEffect } from "react";
import { FileText, Calendar, Tag, Plus, Search } from "lucide-react";
import UploadModal from "../components/UploadModal";
import StatCard from "../components/StatCard";
import DocumentCard from "../components/DocumentCard";
import { apiRequest } from "../utils/api";
import { useToast } from "../context/ToastContext";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const { addToast } = useToast();

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        category: category === "All" ? "" : category,
        search,
      }).toString();

      const data = await apiRequest(`/document?${query}`);
      setDocs(data);
    } catch (err) {
      addToast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [category, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;
    try {
      await apiRequest(`/document/${id}`, "DELETE");
      addToast("Document deleted", "success");
      fetchDocs();
    } catch (err) {
      addToast("Delete failed", "error");
    }
  };

  const handleReprocess = async (id) => {
    try {
      addToast("Reprocessing started...", "success");
      await apiRequest(`/document/${id}/reprocess`, "PATCH");
      addToast("Document reprocessed!", "success");
      fetchDocs();
    } catch (err) {
      addToast("Reprocess failed", "error");
    }
  };

  const stats = {
    total: docs.length,
    recent: docs.filter(
      (d) =>
        new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    categories: [...new Set(docs.map((d) => d.category))].length,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Documents"
          value={stats.total}
          icon={FileText}
          variant="blue"
        />
        <StatCard
          title="New This Week"
          value={stats.recent}
          icon={Calendar}
          variant="emerald"
        />
        <StatCard
          title="Active Categories"
          value={stats.categories}
          icon={Tag}
          variant="purple"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search files or extracted text..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {["All", "Passport", "Invoice", "Licence", "Medical", "General"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Upload</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            No documents found
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Upload your first document to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {docs.map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              onDelete={handleDelete}
              onReprocess={handleReprocess}
            />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          isOpen={showUpload} // FIXED: Added missing prop here
          onClose={() => setShowUpload(false)}
          onUploadSuccess={() => {
            setShowUpload(false);
            fetchDocs();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
