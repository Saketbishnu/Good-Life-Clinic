import mongoose from 'mongoose'
import doctorModel from '../models/doctorModel.js'

const publicDoctorFields = '-password'

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

export { listDoctors, getDoctorById }
