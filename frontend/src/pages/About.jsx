import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="px-6 md:px-16 lg:px-28 py-12 text-gray-800">
      
      {/* Heading */}
      <div className="text-center text-2xl md:text-3xl font-semibold text-gray-700">
        <p>
          ABOUT <span className="text-blue-600 font-medium">US</span>
        </p>
      </div>

      {/* About Content */}
      <div className="my-12 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Image Section */}
        <img 
          className="w-full md:max-w-[360px] rounded-lg shadow-lg" 
          src={assets.about_image} 
          alt="About Prescripto" 
        />

        {/* Text Section */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-blue-600">Good-Life-Clinic</span>, 
            your trusted partner in managing your healthcare needs conveniently and efficiently. 
            We understand the challenges of keeping up with medical appointments, managing 
            health records, and finding the right doctor. That’s why we’ve built a seamless 
            platform designed to simplify your healthcare journey.
          </p>
          <p>
            Good-Life Clinic is committed to excellence in healthcare technology. We continuously 
            strive to improve our services and provide patients with secure, accessible, and 
            reliable healthcare solutions.
          </p>
          
          {/* Vision Section */}
          <div>
            <b className="text-lg text-gray-800">Our Vision</b>
            <p className="mt-2">
              Our vision at Good-life-Clinic is to create a seamless healthcare experience for 
              everyone. We aim to bridge the gap between patients and healthcare providers 
              through technology, ensuring timely access to quality medical services.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="my-16 text-center max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At this Clinic, our mission is to empower individuals by making healthcare simple, 
          transparent, and accessible. From booking appointments with top doctors to managing 
          prescriptions, we are dedicated to delivering healthcare at your fingertips.
        </p>
      </div>
      {/* Extra Images Section */}
      <h2 className="text-xl md:text-2xl text-center font-semibold text-gray-800 mb-4">Our Equipment</h2>
<div className="my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  
  <img 
    src={assets.about1} 
    alt="Clinic service 1" 
    className="w-full rounded-lg shadow-md hover:scale-105 transition-transform"
  />
  <img 
    src={assets.about2} 
    alt="Clinic service 2" 
    className="w-full rounded-lg shadow-md hover:scale-105 transition-transform"
  />
  <img 
    src={assets.about3} 
    alt="Clinic service 3" 
    className="w-full rounded-lg shadow-md hover:scale-105 transition-transform"
  />
</div>
    </div>
  )
}

export default About
