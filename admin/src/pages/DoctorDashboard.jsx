import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'

const DoctorDashboard = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const doctorToken = localStorage.getItem('doctorToken') || ''

  const logout = () => {
    localStorage.removeItem('doctorToken')
    navigate('/doctor-login')
  }

  const getAppointments = useCallback(async () => {
    if (!doctorToken) {
      setIsLoading(false)
      navigate('/doctor-login')
      return
    }

    try {
      setIsLoading(true)
      const { data } = await api.get('/api/doctor/appointments', {
        headers: {
          Authorization: `Bearer ${doctorToken}`
        }
      })

      if (data.success) {
        setAppointments(data.appointments || [])
      } else {
        setMessage(data.message || 'Failed to load appointments')
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('doctorToken')
        navigate('/doctor-login')
        return
      }

      setMessage(error.response?.data?.message || 'Failed to load appointments')
    } finally {
      setIsLoading(false)
    }
  }, [doctorToken, navigate])

  useEffect(() => {
    getAppointments()
  }, [getAppointments])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div>
          <p className="text-xl font-semibold text-gray-800">Good Life Clinic</p>
          <p className="text-sm text-gray-500">Doctor Dashboard</p>
        </div>
        <button onClick={logout} className="bg-primary text-white px-5 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-5">My Appointments</h1>
        {message && <p className="text-sm text-red-500 mb-4">{message}</p>}

        {isLoading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="bg-white border rounded-lg overflow-hidden">
            {appointments.map((item) => (
              <div key={item._id} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-3 p-4 border-b text-sm text-gray-700">
                <div>
                  <p className="font-medium">{item.userData?.name}</p>
                  <p>{item.userData?.email}</p>
                  <p>{item.userData?.phone}</p>
                </div>
                <p>{item.slotDate} | {item.slotTime}</p>
                <p>{item.payment ? 'Paid' : 'Unpaid'}</p>
                <p>{item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Active'}</p>
              </div>
            ))}
            {appointments.length === 0 && <p className="p-4 text-gray-600">No appointments found.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard
