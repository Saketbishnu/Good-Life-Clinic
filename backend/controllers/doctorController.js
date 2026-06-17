import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

const publicDoctorFields = '-password'
const TOKEN_EXPIRY = '7d'

const sanitizeDoctor = (doctor) => ({
    _id: doctor._id,
    name: doctor.name,
    email: doctor.email,
    image: doctor.image,
    speciality: doctor.speciality,
    degree: doctor.degree,
    experience: doctor.experience,
    about: doctor.about,
    available: doctor.available,
    fees: doctor.fees,
    address: doctor.address,
    date: doctor.date
})

const createDoctorToken = (doctorId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing. Add it to your backend environment before starting the server.')
    }

    return jwt.sign({ id: doctorId, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

const listDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({ available: true })
            .select(publicDoctorFields)
            .sort({ date: -1 })

        res.status(200).json({
            success: true,
            doctors
        })
    } catch (error) {
        console.error('Error in listDoctors:', error.message)
        res.status(500).json({ success: false, message: 'Failed to fetch doctors' })
    }
}

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID' })
        }

        const doctor = await doctorModel
            .findOne({ _id: id, available: true })
            .select(publicDoctorFields)

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        res.status(200).json({
            success: true,
            doctor
        })
    } catch (error) {
        console.error('Error in getDoctorById:', error.message)
        res.status(500).json({ success: false, message: 'Failed to fetch doctor' })
    }
}

const loginDoctor = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const isPasswordMatch = await bcrypt.compare(password, doctor.password)

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const token = createDoctorToken(doctor._id)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            doctor: sanitizeDoctor(doctor)
        })
    } catch (error) {
        console.error('Error in loginDoctor:', error.message)
        res.status(500).json({ success: false, message: 'Login failed' })
    }
}

const doctorAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel
            .find({ doctorId: req.doctorId })
            .sort({ date: -1 })

        res.status(200).json({
            success: true,
            appointments
        })
    } catch (error) {
        console.error('Error in doctorAppointments:', error.message)
        res.status(500).json({ success: false, message: 'Failed to fetch appointments' })
    }
}

const doctorProfile = async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.doctorId).select(publicDoctorFields)

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        res.status(200).json({
            success: true,
            doctor: sanitizeDoctor(doctor)
        })
    } catch (error) {
        console.error('Error in doctorProfile:', error.message)
        res.status(500).json({ success: false, message: 'Failed to fetch doctor profile' })
    }
}

export { listDoctors, getDoctorById, loginDoctor, doctorAppointments, doctorProfile }
