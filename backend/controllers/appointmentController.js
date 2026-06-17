import mongoose from 'mongoose'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
import { DEFAULT_PROFILE_IMAGE } from '../constants/defaults.js'

const sanitizeUserData = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image || DEFAULT_PROFILE_IMAGE,
    address: user.address,
    gender: user.gender,
    dob: user.dob,
    phone: user.phone
})

const sanitizeDoctorData = (doctor) => ({
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

const validateSlotInput = ({ doctorId, slotDate, slotTime }) => {
    if (!mongoose.isValidObjectId(doctorId)) {
        return 'Invalid doctor ID'
    }

    if (!slotDate || typeof slotDate !== 'string' || !/^[A-Za-z0-9_/-]+$/.test(slotDate)) {
        return 'Invalid slot date'
    }

    if (!slotTime || typeof slotTime !== 'string' || slotTime.length > 20) {
        return 'Invalid slot time'
    }

    return null
}

const bookAppointment = async (req, res) => {
    const doctorId = req.body.doctorId
    const slotDate = req.body.slotDate?.trim()
    const slotTime = req.body.slotTime?.trim()
    const validationError = validateSlotInput({ doctorId, slotDate, slotTime })
    let slotReserved = false

    if (validationError) {
        return res.status(400).json({ success: false, message: validationError })
    }

    try {
        const user = await userModel.findById(req.userId).lean()
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const doctor = await doctorModel.findById(doctorId).select('-password').lean()
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        if (!doctor.available) {
            return res.status(409).json({ success: false, message: 'Doctor is not available for booking' })
        }

        const slotPath = `slots_booked.${slotDate}`
        const reservedDoctor = await doctorModel
            .findOneAndUpdate(
                { _id: doctorId, available: true, [slotPath]: { $ne: slotTime } },
                { $addToSet: { [slotPath]: slotTime } },
                { new: true }
            )
            .select('-password')
            .lean()

        if (!reservedDoctor) {
            return res.status(409).json({ success: false, message: 'Slot is already booked' })
        }

        slotReserved = true

        const appointment = await appointmentModel.create({
            userId: req.userId,
            doctorId,
            slotDate,
            slotTime,
            amount: reservedDoctor.fees,
            userData: sanitizeUserData(user),
            doctorData: sanitizeDoctorData(reservedDoctor)
        })

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment
        })
    } catch (error) {
        if (slotReserved) {
            await doctorModel.updateOne(
                { _id: doctorId },
                { $pull: { [`slots_booked.${slotDate}`]: slotTime } }
            )
        }

        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Slot is already booked' })
        }

        console.error('Error in bookAppointment:', error.message)
        res.status(500).json({ success: false, message: 'Failed to book appointment' })
    }
}

const listUserAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel
            .find({ userId: req.userId })
            .sort({ date: -1 })

        res.status(200).json({
            success: true,
            appointments
        })
    } catch (error) {
        console.error('Error in listUserAppointments:', error.message)
        res.status(500).json({ success: false, message: 'Failed to fetch appointments' })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body

        if (!mongoose.isValidObjectId(appointmentId)) {
            return res.status(400).json({ success: false, message: 'Invalid appointment ID' })
        }

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            userId: req.userId
        })

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }

        if (appointment.cancelled) {
            return res.status(409).json({ success: false, message: 'Appointment is already cancelled' })
        }

        if (appointment.isCompleted) {
            return res.status(409).json({ success: false, message: 'Completed appointments cannot be cancelled' })
        }

        await doctorModel.updateOne(
            { _id: appointment.doctorId },
            { $pull: { [`slots_booked.${appointment.slotDate}`]: appointment.slotTime } }
        )

        appointment.cancelled = true
        await appointment.save()

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully'
        })
    } catch (error) {
        console.error('Error in cancelAppointment:', error.message)
        res.status(500).json({ success: false, message: 'Failed to cancel appointment' })
    }
}

export { bookAppointment, listUserAppointments, cancelAppointment }
