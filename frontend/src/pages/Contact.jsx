import React, { useState } from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 sm:px-8 md:px-16 py-10 flex flex-col items-center justify-center">
      {/* Header Section */}
      <div className="text-center mb-10 animate-fade-in px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Connect With Us
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-xl md:max-w-2xl mx-auto">
          Your health is our priority. Reach out for appointments, inquiries, or medical support.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl w-full">
        {/* Contact Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100/50 transition-transform duration-300 hover:scale-105">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all text-sm sm:text-base"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all text-sm sm:text-base"
                placeholder="Your Email"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all text-sm sm:text-base"
                placeholder="Your Message"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg transition-all duration-300 shadow-md text-sm sm:text-base ${
                isSubmitting
                  ? "bg-teal-300 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {status && (
              <p
                className={`text-center mt-3 text-sm sm:text-base ${
                  status.includes("success") ? "text-green-600" : "text-red-600"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>

        {/* Contact Info & Image */}
        <div className="space-y-6 sm:space-y-8">
          {/* Contact Info */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100/50 transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
              Get in Touch
            </h2>
            <div className="space-y-5 sm:space-y-6 text-sm sm:text-base">
              {/* Phone */}
              <div>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="text-teal-500">📞</span> Phone
                </p>
                <a
                  href="tel:+917739097511"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  +91 77390 97511
                </a>
              </div>
              {/* Email */}
              <div>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="text-teal-500">📧</span> Email
                </p>
                <a
                  href="mailto:goodlifeclinickunjora@gmail.com"
                  className="text-teal-600 hover:text-teal-700 transition-colors break-words"
                >
                  goodlifeclinickunjora@gmail.com
                </a>
              </div>
              {/* Address */}
              <div>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="text-teal-500">📍</span> Address
                </p>
                <p className="text-gray-700">4W2P+698, Kunjora, Jharkhand 815357</p>
                <a
                  href="https://goo.gl/maps/qtvmHCgjrasCdaW99"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  View on Google Maps
                </a>
              </div>
              {/* Opening Hours */}
              <div>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="text-teal-500">⏰</span> Opening Hours
                </p>
                <p className="text-gray-700">8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Clinic Image */}
          <div className="flex justify-center">
            <img
              src={assets.contact_image}
              alt="Goodlife Clinic"
              className="rounded-2xl md:rounded-3xl shadow-lg w-full max-w-sm sm:max-w-md object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Contact;
