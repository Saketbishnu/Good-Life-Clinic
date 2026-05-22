import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContext'

const Doctors = () => {
  const { api, doctors, getDoctors } = useContext(AdminContext)
  const [message, setMessage] = useState('')

  const loadDoctors = useCallback(async () => {
    try {
      setMessage('')
      await getDoctors()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load doctors')
    }
  }, [getDoctors])

  const toggleAvailability = async (doctorId) => {
    try {
      const { data } = await api.post('/api/admin/change-availability', { doctorId })

      if (data.success) {
        await loadDoctors()
      } else {
        setMessage(data.message || 'Failed to update doctor')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update doctor')
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [loadDoctors])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-5">Doctors</h1>
      {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="border rounded-lg bg-white overflow-hidden">
            <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-contain bg-blue-50" />
            <div className="p-4 space-y-2">
              <p className="font-medium">{doctor.name}</p>
              <p className="text-sm text-gray-600">{doctor.speciality}</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={doctor.available}
                  onChange={() => toggleAvailability(doctor._id)}
                />
                Available
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors
