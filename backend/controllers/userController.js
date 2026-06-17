import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import { DEFAULT_PROFILE_IMAGE } from '../constants/defaults.js'

const TOKEN_EXPIRY = '7d'
const allowedProfileImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_PROFILE_IMAGE_DATA_LENGTH = 7 * 1024 * 1024

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
    image: user.image || DEFAULT_PROFILE_IMAGE,
    address: user.address,
    gender: user.gender,
    dob: user.dob,
    phone: user.phone
})

const isProfileImageDataUrl = (image) => {
    if (typeof image !== 'string' || image.length > MAX_PROFILE_IMAGE_DATA_LENGTH) {
        return false
    }

    const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,/)

    return Boolean(match && allowedProfileImageTypes.has(match[1]))
}

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

const validateProfileInput = ({ name, phone, address, gender, dob, image }) => {
    if (name !== undefined && (!name.trim() || name.trim().length > 80)) {
        return 'Name must be between 1 and 80 characters'
    }

    if (phone !== undefined && (typeof phone !== 'string' || !/^[0-9+\-\s()]{7,20}$/.test(phone))) {
        return 'Please enter a valid phone number'
    }

    if (address !== undefined) {
        if (typeof address !== 'object' || address === null || Array.isArray(address)) {
            return 'Address must be an object'
        }

        if (address.line1 !== undefined && (typeof address.line1 !== 'string' || address.line1.length > 120)) {
            return 'Address line 1 is invalid'
        }

        if (address.line2 !== undefined && (typeof address.line2 !== 'string' || address.line2.length > 120)) {
            return 'Address line 2 is invalid'
        }
    }

    if (gender !== undefined && !['Male', 'Female', 'Other', 'Not Selected'].includes(gender)) {
        return 'Invalid gender'
    }

    if (dob !== undefined && dob !== 'Not Selected' && !validator.isISO8601(dob)) {
        return 'Invalid date of birth'
    }

    if (
        image !== undefined &&
        image !== '' &&
        !validator.isURL(image, { require_protocol: true }) &&
        !isProfileImageDataUrl(image)
    ) {
        return 'Image must be a valid URL'
    }

    return null
}

const uploadProfileImage = async (image) => {
    if (!image || image === DEFAULT_PROFILE_IMAGE) {
        return DEFAULT_PROFILE_IMAGE
    }

    if (isProfileImageDataUrl(image)) {
        const uploadResult = await cloudinary.uploader.upload(image, {
            resource_type: 'image',
            folder: 'good-life-clinic/users'
        })

        return uploadResult.secure_url
    }

    return image
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
            password: hashedPassword,
            image: DEFAULT_PROFILE_IMAGE
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

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({
            success: true,
            user: sanitizeUser(user)
        })
    } catch (error) {
        console.error('Error in getUserProfile:', error.message)
        res.status(500).json({ success: false, message: 'Failed to fetch profile' })
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address, gender, dob, image } = req.body
        const validationError = validateProfileInput({ name, phone, address, gender, dob, image })

        if (validationError) {
            return res.status(400).json({ success: false, message: validationError })
        }

        const updates = {}

        if (name !== undefined) updates.name = name.trim()
        if (phone !== undefined) updates.phone = phone.trim()
        if (address !== undefined) {
            updates.address = {
                line1: address.line1?.trim() || '',
                line2: address.line2?.trim() || ''
            }
        }
        if (gender !== undefined) updates.gender = gender
        if (dob !== undefined) updates.dob = dob
        if (image !== undefined) updates.image = await uploadProfileImage(image)

        const user = await userModel.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: sanitizeUser(user)
        })
    } catch (error) {
        console.error('Error in updateUserProfile:', error.message)
        res.status(500).json({ success: false, message: 'Failed to update profile' })
    }
}

export { registerUser, loginUser, getUserProfile, updateUserProfile }
