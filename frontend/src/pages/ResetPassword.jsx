import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { api } = useContext(AppContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords must match");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post("/api/user/reset-password", {
        token,
        password,
      });

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message || "Password reset successful");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 px-2">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${isSuccess ? "text-green-700" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
