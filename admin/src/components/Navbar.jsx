import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { adminToken, setAdminToken } = useContext(AdminContext)

  const logout = () => {
    setAdminToken('')
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div>
        <p className="text-xl font-semibold text-gray-800">Good Life Clinic</p>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      {adminToken && (
        <button onClick={logout} className="bg-primary text-white px-5 py-2 rounded">
          Logout
        </button>
      )}
    </div>
  )
}

export default Navbar
