import express from 'express'
import { forgotPassword, getUserProfile, loginUser, registerUser, resetPassword, updateUserProfile } from '../controllers/userController.js'
import { bookAppointment, cancelAppointment, listUserAppointments } from '../controllers/appointmentController.js'
import authUser from '../middlewares/authUser.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/profile', authUser, getUserProfile)
userRouter.put('/update-profile', authUser, updateUserProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listUserAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)

export default userRouter
