import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
      {/* --------left side header-------- */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
            Book Appointment <br/> With Trusted Doctor 
        </p>
        <div className='flex felx-col md:flex-row items-center gap-3 text-white text-sm font-light'>
            <img src={assets.group_profiles} alt="group_profiles" />
              <p> "हमारे भरोसेमंद डॉक्टरों की विस्तृत सूची देखें और <br className='hidden sm:block'/>बिना किसी झंझट के अपनी अपॉइंटमेंट बुक करें।"
  </p>
             <p className="text-3xl md:text-4xl font-bold text-yellow-300 animate-blink mt-2">
    Good Life Clinic
  </p>
           <p className="text-xl md:text-2xl font-semibold text-white animate-blink">
    आपकी सेहत, हमारी प्राथमिकता
  </p>
        </div>
        <a href="#speciality"
  className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-300">
  Book Appointment
  <img src={assets.arrow_icon} alt="" className="w-5 h-5" />
</a>

      </div>

      {/* --------right side header-------- */}
      <div className='md:w-1/2 relative'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="header_img" />
      </div>
    </div>
  )
}

export default Header
