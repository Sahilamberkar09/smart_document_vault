import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiRequest } from "../utils/api";
import { useToast } from "../context/ToastContext";

const Register = ({ setToken, setUser, setView }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest("/auth/register", "POST", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      addToast("Account created successfully!", "success");
    } catch (err) {
      addToast(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 mt-2">
          Start organizing your documents today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center text-gray-600">
        Already have an account?
        <button
          onClick={() => setView("login")}
          className="text-indigo-600 font-bold ml-1 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Register;
