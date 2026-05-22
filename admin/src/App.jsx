import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { AdminContext } from './context/AdminContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Doctors from './pages/Doctors'
import AddDoctor from './pages/AddDoctor'
import Appointments from './pages/Appointments'

const ProtectedLayout = ({ children }) => {
  const { adminToken } = useContext(AdminContext)

  if (!adminToken) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-x-auto">
          {children}
        </div>
      </div>
    </>
  )
}

const App = () => {
  const { adminToken } = useContext(AdminContext)

  return (
    <Routes>
      <Route path="/login" element={adminToken ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/doctors" element={<ProtectedLayout><Doctors /></ProtectedLayout>} />
      <Route path="/add-doctor" element={<ProtectedLayout><AddDoctor /></ProtectedLayout>} />
      <Route path="/appointments" element={<ProtectedLayout><Appointments /></ProtectedLayout>} />
    </Routes>
  )
}

export default App
