import React from "react";

const StatCard = ({ title, value, icon: Icon, variant = "blue" }) => {
  const styles = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
  };

  const style = styles[variant] || styles.blue;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`p-4 rounded-xl ${style.bg} ${style.text} relative overflow-hidden`}
      >
        <Icon className="w-6 h-6 relative z-10" strokeWidth={2.5} />
        <div className="absolute inset-0 bg-current opacity-10"></div>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
