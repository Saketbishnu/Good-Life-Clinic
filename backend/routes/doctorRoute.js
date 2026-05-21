import express from 'express'
import { getDoctorById, listDoctors } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', listDoctors)
doctorRouter.get('/:id', getDoctorById)

export default doctorRouter
