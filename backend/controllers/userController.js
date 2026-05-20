import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import userModel from '../models/userModel.js'

const TOKEN_EXPIRY = '7d'

const createToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing. Add it to your backend environment before starting the server.')
    }

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    address: user.address,
    gender: user.gender,
    dob: user.dob,
    phone: user.phone
})

const validateAuthInput = ({ name, email, password }, requireName = false) => {
    if (requireName && (!name || !name.trim())) {
        return 'Name is required'
    }

    if (!email || !validator.isEmail(email)) {
        return 'Please enter a valid email'
    }

    if (!password || password.length < 8) {
        return 'Password must be at least 8 characters long'
    }

    return null
}

const registerUser = async (req, res) => {
    try {
        const name = req.body.name?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password

        const validationError = validateAuthInput({ name, email, password }, true)
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        const token = createToken(savedUser._id)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: sanitizeUser(savedUser)
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        console.error('Error in registerUser:', error.message)
        res.status(500).json({ success: false, message: 'Registration failed' })
    }
}

const loginUser = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password

        const validationError = validateAuthInput({ email, password })
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError })
        }

        const user = await userModel.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const token = createToken(user._id)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: sanitizeUser(user)
        })
    } catch (error) {
        console.error('Error in loginUser:', error.message)
        res.status(500).json({ success: false, message: 'Login failed' })
    }
}

export { registerUser, loginUser }
