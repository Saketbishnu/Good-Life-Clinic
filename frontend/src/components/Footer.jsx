import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin,FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-white text-gray-700 border-t border-gray-300 py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left section */}
        <div>
          <img src="/good-life.jpg" alt="logo" className="w-45 h-40" />
          <p className="mt-4 text-sm text-gray-600">
            Good Life Clinic is dedicated to providing trusted healthcare
            services with expert doctors and modern facilities. Your health is our priority.
          </p>
        </div>

        {/* Middle section */}
        <div>
          <p className="font-bold mb-4">CONTACT</p>
          <p className="flex items-center gap-2">
            📞 +91 98765 43210
          </p>
          <div className="flex gap-4 mt-3">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaFacebook size={20} />
            </a>
          </div>
        </div>

        {/* Right section */}
        <div>
          <p className="font-bold mb-4">DEVELOPER CONTACT(SAKET)</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.linkedin.com/in/saket-bishnu-00769a269/" className="text-gray-600 hover:text-blue-600">
              <FaLinkedin size={20} />
            </a>
            <a href="https://github.com/Saketbishnu" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <FaGithub />
              </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      
    </div>
  );
};

export default Footer;
