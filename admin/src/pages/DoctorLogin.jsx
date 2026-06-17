import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'

const DoctorLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setMessage('')
    setIsSubmitting(true)

    try {
      const { data } = await api.post('/api/doctor/login', { email, password })

      if (data.success && data.token) {
        setMessage('')
        localStorage.setItem('doctorToken', data.token)
        navigate('/doctor-dashboard')
      } else {
        setMessage(data.message || 'Invalid credentials')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-8 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Doctor Login</h1>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Doctor email"
            className="w-full border px-4 py-2 rounded text-gray-900 placeholder:text-gray-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border px-4 py-2 rounded text-gray-900 placeholder:text-gray-400"
            required
          />
          <button disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded">
            {isSubmitting ? 'Please wait...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-primary text-sm hover:underline"
          >
            Back to Admin Login
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  )
}

export default DoctorLogin
