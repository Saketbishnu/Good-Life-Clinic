import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function SignupLogin() {
  const navigate = useNavigate();
  const { api, setToken } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? "/api/user/login" : "/api/user/register";
      const payload = isLogin
        ? { identifier: formData.email, password: formData.password }
        : formData;

      const { data } = await api.post(endpoint, payload);

      if (data.success && data.token) {
        setToken(data.token);
        navigate("/");
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 px-2">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          )}
          <input
            type={isLogin ? "text" : "email"}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={isLogin ? "Email or Mobile Number" : "Email"}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          {!isLogin && (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              maxLength="10"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          )}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-indigo-600 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        {/* Toggle Button */}
        <p className="mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

