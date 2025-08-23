import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [token, setToken] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // ✅ Mobile Menu toggle

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(true);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", "true");
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // ---------------- HANDLERS ----------------
  const handleLogout = () => {
    setToken(false);
    setShowDropdown(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/myprofile");
    setShowDropdown(false);
  };

  const handleAppointmentClick = () => {
    navigate("/myappointment");
    setShowDropdown(false);
  };

  const handleCreateAccount = () => {
    setToken(true);
    navigate("/login");
  };

  // ---------------- RENDER ----------------
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      {/* Logo */}
      <img
        onClickCapture={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/")}
      />

      {/* Navigation Links (Desktop) */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
          HOME
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
          ALL DOCTORS
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
          ABOUT
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
          CONTACT
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative" onClick={() => setShowDropdown(!showDropdown)}>
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />

            {showDropdown && (
              <div className="absolute top-10 right-0 min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 text-gray-600 text-base font-medium shadow-lg z-50">
                <p onClick={handleProfileClick} className="hover:text-black cursor-pointer">
                  My Profile
                </p>
                <p onClick={handleAppointmentClick} className="hover:text-black cursor-pointer">
                  My Appointment
                </p>
                <p onClick={handleLogout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
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

        {/* Mobile Menu Icon */}
        <img onClick={() => setShowMenu(true)} className="w-6 md:hidden cursor-pointer" src={assets.menu_icon} alt="menu" />
      </div>

      {/* ---------------- MOBILE MENU + OVERLAY ---------------- */}
      {showMenu && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMenu(false)}></div>}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-all duration-300 
          ${showMenu ? "w-3/4 p-6" : "w-0 overflow-hidden"}`}
      >
        {/* Top Section with Logo + Close Button */}
        <div className="flex items-center justify-between">
          {/* Doctor Logo on Left */}
          <img
            onClick={() => {
              navigate("/");
              setShowMenu(false);
            }}
            className="w-28 cursor-pointer"
            src={assets.logo} // 🔑 You can replace with assets.doctor_logo if you add one
            alt="Doctor Logo"
          />
          {/* Close Button on Right */}
          <img onClick={() => setShowMenu(false)} className="w-6 cursor-pointer" src={assets.cross_icon} alt="close" />
        </div>

        {/* Menu Links */}
        <ul className="flex flex-col gap-6 mt-8 text-lg font-medium">
          <NavLink to="/" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
            HOME
          </NavLink>
          <NavLink to="/doctors" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
            ALL DOCTORS
          </NavLink>
          <NavLink to="/about" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "underline font-semibold" : "hover:underline")}>
            CONTACT
          </NavLink>

          {!token && (
            <button
              onClick={() => {
                handleCreateAccount();
                setShowMenu(false);
              }}
              className="bg-primary text-white px-6 py-3 rounded-full font-light"
            >
              Create Account
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
