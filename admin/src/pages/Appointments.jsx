import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContext'

const Appointments = () => {
  const { appointments, getAppointments } = useContext(AdminContext)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getAppointments().catch((error) => {
      setMessage(error.response?.data?.message || 'Failed to load appointments')
    })
  }, [getAppointments])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-5">Appointments</h1>
      {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
      <div className="bg-white border rounded-lg overflow-hidden">
        {appointments.map((item) => (
          <div key={item._id} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr] gap-3 p-4 border-b text-sm text-gray-700">
            <div>
              <p className="font-medium">{item.doctorData?.name}</p>
              <p>{item.doctorData?.speciality}</p>
            </div>
            <div>
              <p className="font-medium">{item.userData?.name}</p>
              <p>{item.userData?.email}</p>
              <p>{item.userData?.phone}</p>
            </div>
            <p>{item.slotDate} | {item.slotTime}</p>
            <p>{item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Active'}</p>
          </div>
        ))}
        {appointments.length === 0 && <p className="p-4 text-gray-600">No appointments found.</p>}
      </div>
    </div>
  )
}

export default Appointments

