import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const normalizeUserData = (user) => ({
  name: user?.name || '',
  image: user?.image || assets.profile_pic,
  email: user?.email || '',
  phone: user?.phone || '',
  address: {
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || ''
  },
  gender: user?.gender || 'Not Selected',
  dob: user?.dob || 'Not Selected'
})

const Myprofile = () => {
  const navigate = useNavigate()
  const { api, token, setUserData: setContextUserData } = useContext(AppContext)
  const [userData, setUserData] = useState(normalizeUserData())
  const [selectedImageData, setSelectedImageData] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const profileContainerStyle = { maxWidth: "600px", width: "100%", boxSizing: "border-box", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }
  const inputStyle = { width: "100%", maxWidth: "100%", boxSizing: "border-box" }

  const getUserProfile = useCallback(async () => {
    if (!token) {
      setIsLoading(false)
      navigate('/login')
      return
    }

    try {
      setIsLoading(true)
      const { data } = await api.get('/api/user/profile')

      if (data.success) {
        setUserData(normalizeUserData(data.user))
      } else {
        setMessage(data.message || 'Failed to load profile')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }, [api, navigate, token])

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  const handleSaveProfile = async () => {
    try {
      setMessage('')

      const payload = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        dob: userData.dob
      }

      if (selectedImageData) {
        payload.image = selectedImageData
      }

      const { data } = await api.put('/api/user/update-profile', payload)

      if (data.success) {
        const normalizedUser = normalizeUserData(data.user)
        setUserData(normalizedUser)
        setContextUserData(normalizedUser)
        setSelectedImageData('')
        setIsEdit(false)
        setMessage('')
      } else {
        setMessage(data.message || 'Failed to update profile')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile')
    }
  }

  // Handle image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImageData(reader.result)
        setUserData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <div style={profileContainerStyle}>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div style={profileContainerStyle}>
      {/* Profile Image */}
      <div style={{ textAlign: "center" }}>
        <img
          src={userData.image}
          alt="Profile"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "3px solid #555" }}
        />
        {isEdit && (
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ maxWidth: "100%" }} />
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
            style={inputStyle}
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
            style={inputStyle}
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
              style={inputStyle}
            /><br />
            <input
              type="text"
              value={userData.address.line2}
              onChange={(e) => setUserData(prev => ({
                ...prev, address: { ...prev.address, line2: e.target.value }
              }))}
              style={inputStyle}
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
            style={{ ...inputStyle, padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
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
            value={userData.dob === 'Not Selected' ? '' : userData.dob}
            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value || 'Not Selected' }))}
            style={{ ...inputStyle, padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        ) : (
          <p>{userData.dob}</p>
        )}
      </div>

      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

      {/* Edit / Save Button */}
      {
        isEdit
        ? <button
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600"
            onClick={handleSaveProfile}
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
