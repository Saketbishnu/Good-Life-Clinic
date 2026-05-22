import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'

const initialForm = {
  name: '',
  email: '',
  password: '',
  speciality: '',
  degree: '',
  experience: '',
  fees: '',
  about: '',
  line1: '',
  line2: '',
}

const AddDoctor = () => {
  const { api, getDoctors } = useContext(AdminContext)
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('password', form.password)
      formData.append('speciality', form.speciality)
      formData.append('degree', form.degree)
      formData.append('experience', form.experience)
      formData.append('fees', form.fees)
      formData.append('about', form.about)
      formData.append('address', JSON.stringify({ line1: form.line1, line2: form.line2 }))

      const { data } = await api.post('/api/admin/add-doctor', formData)

      if (data.success) {
        setMessage(data.message || 'Doctor added')
        setForm(initialForm)
        setImage(null)
        await getDoctors()
      } else {
        setMessage(data.message || 'Failed to add doctor')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add doctor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-5">Add Doctor</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 max-w-4xl space-y-4">
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="block" required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Doctor name" className="border px-3 py-2 rounded" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Doctor email" className="border px-3 py-2 rounded" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border px-3 py-2 rounded" required />
          <input name="speciality" value={form.speciality} onChange={handleChange} placeholder="Speciality" className="border px-3 py-2 rounded" required />
          <input name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" className="border px-3 py-2 rounded" required />
          <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience" className="border px-3 py-2 rounded" required />
          <input name="fees" type="number" value={form.fees} onChange={handleChange} placeholder="Fees" className="border px-3 py-2 rounded" required />
          <input name="line1" value={form.line1} onChange={handleChange} placeholder="Address line 1" className="border px-3 py-2 rounded" required />
          <input name="line2" value={form.line2} onChange={handleChange} placeholder="Address line 2" className="border px-3 py-2 rounded" required />
        </div>
        <textarea name="about" value={form.about} onChange={handleChange} placeholder="About doctor" className="border px-3 py-2 rounded w-full min-h-28" required />
        <button disabled={isSubmitting} className="bg-primary text-white px-6 py-2 rounded">
          {isSubmitting ? 'Adding...' : 'Add Doctor'}
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  )
}

export default AddDoctor
