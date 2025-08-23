import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointment = () => {
  const { doctors } = useContext(AppContext)

  return (
    <div>
      <h1>My Appointments</h1>

      <div>
        {doctors.slice(0, 5).map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:flex sm:gap-6 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.image} alt={item.name} />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p>{item.name}</p>
              <p>{item.speciality}</p>
              <p>Address:</p>
              <p>{item.address.line1}</p>
              <p>{item.address.line2}</p>
              <p>
                <span>Date & Time:</span> 25, July, 2024 | 8:30 PM
              </p>
            </div>
         <div className="flex flex-col gap-2 justify-end">
  <button
    className="bg-green-500 text-white px-2 py-2 text-sm font-medium rounded-md shadow-sm 
               hover:bg-blue-600 transition duration-300"
  >
    Pay Online
  </button>
  <button
    className="bg-white-500 text-black px-3 py-2 text-sm font-medium rounded-md shadow-sm 
               hover:bg-red-600 transition duration-300"
  >
    Cancel Appointment
  </button>
</div>


          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointment
