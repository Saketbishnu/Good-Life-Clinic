import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Doctor from './pages/Doctors'
import Login from './pages/Login'
import MyAppointment from './pages/MyAppointment'
import About from './pages/About'
import Contact from './pages/Contact'
import Myprofile from './pages/Myprofile'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
 // ✅ Make sure src/components/Navbar.jsx exists

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/myprofile" element={<Myprofile />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
    </div>
  )
}

export default App
