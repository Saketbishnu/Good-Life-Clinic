import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `px-5 py-3 border-b text-sm ${isActive ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`

  return (
    <div className="w-56 min-h-screen border-r bg-white flex flex-col">
      <NavLink to="/" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/doctors" className={linkClass}>Doctors</NavLink>
      <NavLink to="/add-doctor" className={linkClass}>Add Doctor</NavLink>
      <NavLink to="/appointments" className={linkClass}>Appointments</NavLink>
    </div>
  )
}

export default Sidebar
