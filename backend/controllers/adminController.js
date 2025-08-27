import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'

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

            const token =jwt.sign(email+password,process.env.JWT_SECRET)
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

export { addDoctor ,loginAdmin };