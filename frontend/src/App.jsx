import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'

import Login from './pages/Login'
import MyAppointment from './pages/MyAppointment'
import About from './pages/About'
import Contact from './pages/Contact'
import Myprofile from './pages/Myprofile'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Doctors from './pages/Doctors'
 // ✅ Make sure src/components/Navbar.jsx exists

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctors/>} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/myappointment" element={<MyAppointment />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/myprofile" element={<Myprofile />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
      <Footer/>
      
      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-200 pt-4">
        © 2025 Good Life Clinic. All rights reserved.
      </div>
    </div>
  )
}

export default App
