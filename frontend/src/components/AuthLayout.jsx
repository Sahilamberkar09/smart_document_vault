import React from "react";
import { FileText } from "lucide-react";

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex bg-gray-50">
    <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-700 opacity-90" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
      <div className="relative z-10 text-center px-10">
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl inline-block mb-6 shadow-xl">
          <FileText className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Smart Document Vault
        </h1>
        <p className="text-indigo-100 text-lg max-w-md mx-auto">
          Securely store, organize, and extract text from your important
          documents using AI-powered OCR.
        </p>
      </div>
    </div>
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
