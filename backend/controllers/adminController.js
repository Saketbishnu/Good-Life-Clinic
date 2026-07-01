import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
import mongoose from "mongoose"

const ADMIN_TOKEN_EXPIRY = '7d'

//API for adding Doctor
const addDoctor = async (req,res) =>{
    try {
        const { name, email, password, speciality, degree, experience, about, fees } = req.body;
        const addressString = req.body.address; // Get the address as a string
        const imageFile = req.file;

        // Log req.file to verify if Multer is working correctly
        console.log("Req.file:", imageFile); 

        // Checking for file and required body fields
        if (!imageFile || !name || !email || !password || !speciality || !degree || !experience || !about || !fees || !addressString) {
            // If any of these are missing, the path property will not exist
            return res.json({ success: false, message: "Missing required fields or image file" });
        }

        // Validate email and password first
        if(!validator.isEmail(email)){
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if(password.length < 8){
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Parse the address JSON string
        let parsedAddress;
        try {
            parsedAddress = JSON.parse(addressString);
        } catch (jsonError) {
            return res.json({ success: false, message: "Invalid JSON format for address" });
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hasedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            date:Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added" });

    } catch (error) {
        console.error("Error in addDoctor:", error); // Use console.error for errors
        // Return a more descriptive message
        res.status(500).json({ success: false, message: "An unexpected error occurred. " + error.message });
    }
}

//API FOR THE ADMIN LOGIN
const loginAdmin = async (req,res) => {

    try {

        const {email,password} =req.body
        if (email ==process.env.ADMIN_EMAIL && password ==process.env.ADMIN_PASSWORD) {
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ success: false, message: "JWT_SECRET is not configured" })
            }

            const token =jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: ADMIN_TOKEN_EXPIRY })
            res.json({success:true,token})
            
        } else{
            res.json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        console.error("Error in addDoctor:", error); // Use console.error for errors
        // Return a more descriptive message
        res.status(500).json({ success: false, message: "An unexpected error occurred. " + error.message });

        
    }
}

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password').sort({ date: -1 })

        res.status(200).json({ success: true, doctors })
    } catch (error) {
        console.error("Error in allDoctors:", error.message)
        res.status(500).json({ success: false, message: "Failed to fetch doctors" })
    }
}

const changeDoctorAvailability = async (req, res) => {
    try {
        const { doctorId } = req.body

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required" })
        }

        if (!mongoose.isValidObjectId(doctorId)) {
            return res.status(400).json({ success: false, message: "Invalid doctor ID" })
        }

        const doctor = await doctorModel.findById(doctorId)

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" })
        }

        doctor.available = !doctor.available
        await doctor.save()

        res.status(200).json({
            success: true,
            message: "Doctor availability updated",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                available: doctor.available
            }
        })
    } catch (error) {
        console.error("Error in changeDoctorAvailability:", error.message)
        res.status(500).json({ success: false, message: "Failed to update doctor availability" })
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.body

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required" })
        }

        if (!mongoose.isValidObjectId(doctorId)) {
            return res.status(400).json({ success: false, message: "Invalid doctor ID" })
        }

        const doctor = await doctorModel.findById(doctorId)

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" })
        }

        const activeAppointment = await appointmentModel.exists({
            doctorId,
            cancelled: false,
            isCompleted: false
        })

        if (activeAppointment) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete doctor with active appointments"
            })
        }

        await doctorModel.findByIdAndDelete(doctorId)

        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully"
        })
    } catch (error) {
        console.error("Error in deleteDoctor:", error.message)
        res.status(500).json({ success: false, message: "Failed to delete doctor" })
    }
}

const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({}).sort({ date: -1 })
        const userIds = [...new Set(appointments.map((appointment) => String(appointment.userId)))]
        const users = await userModel
            .find({ _id: { $in: userIds } })
            .select('name email phone')

        const usersById = new Map(users.map((user) => [String(user._id), user]))
        const appointmentsWithLatestUserPhone = appointments.map((appointment) => {
            const appointmentObject = appointment.toObject()
            const latestUser = usersById.get(String(appointment.userId))

            if (!latestUser) {
                return appointmentObject
            }

            return {
                ...appointmentObject,
                userData: {
                    ...appointmentObject.userData,
                    name: latestUser.name,
                    email: latestUser.email,
                    phone: latestUser.phone
                }
            }
        })

        res.status(200).json({ success: true, appointments: appointmentsWithLatestUserPhone })
    } catch (error) {
        console.error("Error in appointmentsAdmin:", error.message)
        res.status(500).json({ success: false, message: "Failed to fetch appointments" })
    }
}
const adminDashboard = async (req, res) => {
    try {
        const [doctors, users, appointments, cancelledAppointments, completedAppointments] = await Promise.all([
            doctorModel.countDocuments({}),
            userModel.countDocuments({}),
            appointmentModel.countDocuments({}),
            appointmentModel.countDocuments({ cancelled: true }),
            appointmentModel.countDocuments({ isCompleted: true })
        ])

        const latestAppointments = await appointmentModel.find({}).sort({ date: -1 }).limit(5)

        res.status(200).json({
            success: true,
            dashboardData: {
                doctors,
                users,
                appointments,
                cancelledAppointments,
                completedAppointments,
                latestAppointments
            }
        })
    } catch (error) {
        console.error("Error in adminDashboard:", error.message)
        res.status(500).json({ success: false, message: "Failed to fetch dashboard data" })
    }
}

export { addDoctor, loginAdmin, allDoctors, changeDoctorAvailability, deleteDoctor, appointmentsAdmin, adminDashboard };

