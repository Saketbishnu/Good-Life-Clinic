import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate=useNavigate() 
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-blue-50">
      
      {/* Left side */}
      <div className="flex flex-col gap-4 max-w-md">
        <p className="text-2xl md:text-4xl font-bold text-gray-800">
          Book Appointment
        </p>
        <p className="text-lg text-gray-600">
          With your trusted doctor
        </p>
        <button onClick={() => {navigate('/login'); scrollTo(0,0)}}
          className="mt-4 bg-white text-sm sm:text-base text-gray-700 px-6 py-2 rounded-full shadow-md 
          hover:bg-blue-600 hover:text-white hover:scale-105 
          transition-all duration-300 ease-in-out"
        >
          Create Account
        </button>
      </div>

      {/* Right side */}
      <div className="mt-8 md:mt-0">
        <img 
          src={assets.appointment_img} 
          alt="appointment_img" 
          className="w-72 md:w-96 object-contain"
        />
      </div>
    </div>
  )
}

export default Banner
