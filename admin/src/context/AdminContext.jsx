import { createContext, useCallback, useEffect, useState } from 'react'
import api, { backendUrl } from '../config/api'

export const AdminContext = createContext()

const AdminContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('adminToken', adminToken)
    } else {
      localStorage.removeItem('adminToken')
    }
  }, [adminToken])

  const getDoctors = useCallback(async () => {
    const { data } = await api.get('/api/admin/all-doctors')

    if (data.success) {
      setDoctors(data.doctors || [])
    }

    return data
  }, [])

  const getAppointments = useCallback(async () => {
    const { data } = await api.get('/api/admin/appointments')

    if (data.success) {
      setAppointments(data.appointments || [])
    }

    return data
  }, [])

  const getDashboardData = useCallback(async () => {
    const { data } = await api.get('/api/admin/dashboard')

    if (data.success) {
      setDashboardData(data.dashboardData)
    }

    return data
  }, [])

  const value = {
    adminToken,
    setAdminToken,
    api,
    backendUrl,
    doctors,
    setDoctors,
    appointments,
    dashboardData,
    getDoctors,
    getAppointments,
    getDashboardData,
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider
