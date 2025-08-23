import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Myprofile = () => {
  const [userData, setUserData] = useState({
    name: "Saket Bishnu",
    image: assets.profile_pic,
    email: 'saketbsn@gmail.com',
    phone: '+91 6008502928',
    address: {
      line1: "Bharthi Dashan, Street",
      line2: "Potheri, Chennai"
    },
    gender: 'Male',
    dob: '2004-03-23'
  })

  const [isEdit, setIsEdit] = useState(false)

  // Handle image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      {/* Profile Image */}
      <div style={{ textAlign: "center" }}>
        <img 
          src={userData.image} 
          alt="Profile" 
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "3px solid #555" }} 
        />
        {isEdit && (
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        )}
      </div>

      {/* Name */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        {isEdit ? (
          <input 
            type="text" 
            value={userData.name} 
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
          />
        ) : (
          <h2>{userData.name}</h2>
        )}
      </div>

      <hr />

      {/* Contact Information */}
      <div>
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> {userData.email}</p>

        <p><strong>Phone:</strong></p>
        {isEdit ? (
          <input 
            type="text" 
            value={userData.phone} 
            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
          />
        ) : (
          <p>{userData.phone}</p>
        )}

        <p><strong>Address:</strong></p>
        {isEdit ? (
          <div>
            <input 
              type="text" 
              value={userData.address.line1} 
              onChange={(e) => setUserData(prev => ({
                ...prev, address: { ...prev.address, line1: e.target.value }
              }))} 
            /><br />
            <input 
              type="text" 
              value={userData.address.line2} 
              onChange={(e) => setUserData(prev => ({
                ...prev, address: { ...prev.address, line2: e.target.value }
              }))} 
            />
          </div>
        ) : (
          <p>
            {userData.address.line1} <br />
            {userData.address.line2}
          </p>
        )}
      </div>

     {/* Gender & DOB */}
     <div style={{ marginTop: "15px" }}>
        <p><strong>Gender:</strong></p>
        {isEdit ? (
          <select 
            value={userData.gender} 
            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
            style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <p>{userData.gender}</p>
        )}

        <p><strong>Date of Birth:</strong></p>
        {isEdit ? (
          <input 
            type="date" 
            value={userData.dob} 
            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
            style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        ) : (
          <p>{userData.dob}</p>
        )}
      </div>

      {/* Edit / Save Button */}
      {
        isEdit
        ? <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600" 
            onClick={() => setIsEdit(false)}
          >
            Save Information
          </button>
        : <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600" 
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
      }
    </div>
  )
}

export default Myprofile
