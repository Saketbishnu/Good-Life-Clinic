import express from 'express'
import { doctorAppointments, getDoctorById, listDoctors, loginDoctor } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, doctorAppointments)
doctorRouter.get('/list', listDoctors)
doctorRouter.get('/:id', getDoctorById)

export default doctorRouter
