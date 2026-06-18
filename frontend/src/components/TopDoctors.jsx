import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const {doctors} = useContext(AppContext)
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-white-900 md:mx-10'>
      <h1 className='text-2xl sm:text-3xl font-medium text-center'>Top Doctors to Book</h1>
      <p className='sm:w-1/2 text-center text-sm'>Find your Trusted Doctor</p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0,1).map((item, index) => (
            <div 
              key={item._id} 
              onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}} 
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
            >
                <img className='bg-blue-50 w-full object-contain' src={item.image} alt={item.name}/>
                <div className='p-4'>
                    {/* 👇 APPLY THE BLINK CLASS HERE 👇 */}
                    <div className='flex items-center gap-2 text-sm text-center text-green-500 animate-blink'>
                        <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                    </div>
                    <p className='text-white-900 text-lg font-medium'>{item.name} </p>
                    <p className='text-white-600 text-sm'>{item.speciality}</p>
                </div>
            </div>
        ))}
      </div>
      <button onClick={()=>{navigate('/doctors'); scrollTo(0,0) }}className='bg-blue-500 text-white px-12 py-3 rounded-full mt-10'>more</button>
    </div>
  )
}

export default TopDoctors
