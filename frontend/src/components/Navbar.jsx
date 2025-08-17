import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [token, setToken] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(true);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', 'true');
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // ---------------- HANDLERS ----------------
  const handleLogout = () => {
    setToken(false);
    setShowDropdown(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/myprofile');
    setShowDropdown(false);
  };

  const handleAppointmentsClick = () => {
    navigate('/myappointments');
    setShowDropdown(false);
  };

  const handleCreateAccount = () => {
    setToken(true);
    navigate('/login');
  };

  // ---------------- RENDER ----------------
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">

      {/* Logo */}
      <img onClickCapture={() => navigate('/')}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate('/')}
      />

      {/* Navigation Links */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "underline font-semibold" : "hover:underline"}
        >
          HOME
        </NavLink>
        <NavLink 
          to="/doctor" 
          className={({ isActive }) => isActive ? "underline font-semibold" : "hover:underline"}
        >
          ALL DOCTORS
        </NavLink>
        <NavLink 
          to="/mypage"   // 👈 replace with your actual route (like /my or /dashboard)
          className={({ isActive }) => isActive ? "underline font-semibold" : "hover:underline"}
        >
          MY PAGE
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => isActive ? "underline font-semibold" : "hover:underline"}
        >
          ABOUT
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => isActive ? "underline font-semibold" : "hover:underline"}
        >
          CONTACT
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {token ? (
          <div
            className="flex items-center gap-2 cursor-pointer group relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />

            {showDropdown && (
              <div className="absolute top-10 right-0 min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 text-gray-600 text-base font-medium shadow-lg z-50">
                <p onClick={handleProfileClick} className="hover:text-black cursor-pointer">My Profile</p>
                <p onClick={handleAppointmentsClick} className="hover:text-black cursor-pointer">My Appointment</p>
                <p onClick={handleLogout} className="hover:text-black cursor-pointer">Logout</p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleCreateAccount}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
