import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const RESET_MESSAGE = "If an account with that email exists, a password reset link has been sent.";

const ForgotPassword = () => {
  const { api } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/api/user/forgot-password", { email });
      setMessage(RESET_MESSAGE);
    } catch {
      setMessage(RESET_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 px-2">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
