import React from "react";
import { LogOut, FileText, User, Loader2 } from "lucide-react";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const AppContent = () => {
  const { user, logout } = useAuth();
  const [view, setView] = React.useState("login");

  if (!user) {
    return (
      <AuthLayout>
        {view === "register" ? (
          <Register setView={setView} />
        ) : (
          <Login setView={setView} />
        )}
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            SmartVault
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {user?.name?.charAt(0).toUpperCase() || (
                <User className="w-5 h-5" />
              )}
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
