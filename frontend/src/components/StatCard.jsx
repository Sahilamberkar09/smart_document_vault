import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  // Map color names to actual CSS variables or tailwind classes
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  const iconClass = colorMap[color] || "bg-gray-50 text-gray-600";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div
        className={`p-4 rounded-full ${iconClass} flex items-center justify-center text-xl`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
