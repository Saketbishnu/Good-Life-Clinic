import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'

const Login = () => {
  const navigate = useNavigate()
  const { api, setAdminToken } = useContext(AdminContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      const { data } = await api.post('/api/admin/login', { email, password })

      if (data.success && data.token) {
        setAdminToken(data.token)
        navigate('/')
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Login</h1>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded">
            {isSubmitting ? 'Please wait...' : 'Login'}
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  )
}

export default Login
