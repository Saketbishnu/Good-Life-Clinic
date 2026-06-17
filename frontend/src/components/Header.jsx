import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-4 sm:px-6 md:px-10 lg:px-20 overflow-hidden'>
      {/* --------left side header-------- */}
      <div className='w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 py-10 md:py-[10vw] md:mb-[-30px] text-center md:text-left'>
        <p className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Book Appointment <br /> With Trusted Doctor
        </p>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-3 text-white text-sm font-light max-w-full'>
          <img className='w-20 sm:w-auto flex-shrink-0' src={assets.group_profiles} alt="group_profiles" />
          <p className='max-w-full break-words'>
            "हमारे भरोसेमंद डॉक्टरों की विस्तृत सूची देखें और बिना किसी झंझट के अपनी अपॉइंटमेंट बुक करें।"
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 animate-blink mt-2">
            Good Life Clinic
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white animate-blink">
            आपकी सेहत, हमारी प्राथमिकता
          </p>
        </div>
        <a
          href="#speciality"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-300"
        >
          Book Appointment
          <img src={assets.arrow_icon} alt="" className="w-5 h-5" />
        </a>
      </div>

      {/* --------right side header-------- */}
      <div className='w-full md:w-1/2 relative'>
        <img className='w-full max-w-[420px] md:max-w-none mx-auto md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="header_img" />
      </div>
    </div>
  )
}

export default Header
