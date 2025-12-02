import React from "react";
import { Home, File, Tag, Settings, LogOut, FileText } from "lucide-react";

const Sidebar = ({ user, logout, activeTab, setActiveTab, sidebarOpen }) => {
  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id
          ? "bg-indigo-50 text-indigo-600 font-semibold"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      } ${!sidebarOpen && "justify-center px-2"}`}
    >
      <Icon className="w-5 h-5" />
      {sidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-20 shadow-sm`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <FileText className="w-8 h-8" />
          {sidebarOpen && <span>SmartVault</span>}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        <SidebarItem icon={Home} label="Dashboard" id="dashboard" />
        <SidebarItem icon={File} label="All Files" id="files" />
        <SidebarItem icon={Tag} label="Categories" id="categories" />
        <SidebarItem icon={Settings} label="Settings" id="settings" />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div
          className={`flex items-center gap-3 ${
            !sidebarOpen && "justify-center"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={logout}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
