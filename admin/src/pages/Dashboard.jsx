import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContext'

const Dashboard = () => {
  const { dashboardData, getDashboardData } = useContext(AdminContext)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getDashboardData().catch((error) => {
      setMessage(error.response?.data?.message || 'Failed to load dashboard')
    })
  }, [getDashboardData])

  const stats = [
    ['Doctors', dashboardData?.doctors || 0],
    ['Patients', dashboardData?.users || 0],
    ['Appointments', dashboardData?.appointments || 0],
    ['Cancelled', dashboardData?.cancelledAppointments || 0],
    ['Completed', dashboardData?.completedAppointments || 0],
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-5">Dashboard</h1>
      {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(([label, value]) => (
          <div key={label} className="border rounded-lg bg-white p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">Latest Appointments</h2>
      <div className="border rounded-lg bg-white overflow-hidden">
        {(dashboardData?.latestAppointments || []).map((item) => (
          <div key={item._id} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 border-b text-sm text-gray-700">
            <p>{item.doctorData?.name}</p>
            <p>{item.userData?.name}</p>
            <p>{item.slotDate} | {item.slotTime}</p>
            <p>{item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Active'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
