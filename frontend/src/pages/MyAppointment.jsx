import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const MyAppointment = () => {
  const navigate = useNavigate()
  const { api, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const getUserAppointments = useCallback(async () => {
    if (!token) {
      setIsLoading(false)
      navigate('/login')
      return
    }

    try {
      setIsLoading(true)
      const { data } = await api.get('/api/user/appointments')

      if (data.success) {
        setAppointments(data.appointments || [])
      } else {
        setMessage(data.message || 'Failed to load appointments')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load appointments')
    } finally {
      setIsLoading(false)
    }
  }, [api, navigate, token])

  const cancelAppointment = async (appointmentId) => {
    try {
      setMessage('')
      const { data } = await api.post('/api/user/cancel-appointment', { appointmentId })

      if (data.success) {
        setMessage(data.message || 'Appointment cancelled successfully')
        await getUserAppointments()
      } else {
        setMessage(data.message || 'Failed to cancel appointment')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to cancel appointment')
    }
  }

  useEffect(() => {
    getUserAppointments()
  }, [getUserAppointments])

  if (isLoading) {
    return (
      <div>
        <h1>My Appointments</h1>
        <p>Loading appointments...</p>
      </div>
    )
  }

  return (
    <div>
      <h1>My Appointments</h1>
      {message && <p className="text-sm text-red-500 mt-2">{message}</p>}

      <div>
        {appointments.length > 0 ? appointments.map((item, index) => {
          const doctor = item.doctorData || {}

          return (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:flex sm:gap-6 border-b' key={item._id || index}>
            <div>
              <img className='w-32 bg-indigo-50' src={doctor.image} alt={doctor.name || 'Doctor'} />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p>{doctor.name}</p>
              <p>{doctor.speciality}</p>
              <p>Address:</p>
              <p>{doctor.address?.line1}</p>
              <p>{doctor.address?.line2}</p>
              <p>
                <span>Date & Time:</span> {item.slotDate} | {item.slotTime}
              </p>
              {item.cancelled && <p className="text-red-500">Cancelled</p>}
            </div>
         <div className="flex flex-col gap-2 justify-end">
  <button
    className="bg-green-500 text-white px-2 py-2 text-sm font-medium rounded-md shadow-sm 
               hover:bg-blue-600 transition duration-300"
  >
    Pay Online
  </button>
  <button
    onClick={() => cancelAppointment(item._id)}
    disabled={item.cancelled || item.isCompleted}
    className="bg-white-500 text-black px-3 py-2 text-sm font-medium rounded-md shadow-sm 
               hover:bg-red-600 transition duration-300"
  >
    {item.cancelled ? 'Cancelled' : 'Cancel Appointment'}
  </button>
</div>


          </div>
        )}) : (
          <p className="text-gray-600">No appointments found.</p>
        )}
      </div>
    </div>
  )
}

export default MyAppointment
