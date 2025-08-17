import React from 'react'
import { useParams } from 'react-router-dom'

const Doctor = () => {
  const { speciality} =useParams()
  console.log(speciality)
  return (
    <div>
      <h1>Doctor Page</h1>
    </div>
  )
}

export default Doctor
