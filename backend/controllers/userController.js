import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import { DEFAULT_PROFILE_IMAGE } from '../constants/defaults.js'
import { sendEmail } from '../services/emailService.js'

const TOKEN_EXPIRY = '7d'
const PASSWORD_RESET_EXPIRY = '15m'
const allowedProfileImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_PROFILE_IMAGE_DATA_LENGTH = 7 * 1024 * 1024
const PASSWORD_RESET_MESSAGE = 'If an account exists, a reset link has been sent.'
const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '')
const isValidIndianMobile = (phone) => /^[6-9]\d{9}$/.test(phone)

const createToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing. Add it to your backend environment before starting the server.')
    }

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

const createPasswordResetToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing. Add it to your backend environment before starting the server.')
    }

    return jwt.sign(
        { id: userId, purpose: 'password-reset' },
        process.env.JWT_SECRET,
        { expiresIn: PASSWORD_RESET_EXPIRY }
    )
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

const validateAuthInput = ({ name, email, phone, password }, requireName = false, requirePhone = false) => {
    if (requireName && (!name || !name.trim())) {
        return 'Name is required'
    }

    if (!email || !validator.isEmail(email)) {
        return 'Please enter a valid email'
    }

    if (requirePhone && !isValidIndianMobile(phone)) {
        return 'Phone number must be a valid 10 digit Indian mobile number'
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

    if (phone !== undefined && phone !== '' && !isValidIndianMobile(normalizePhone(phone))) {
        return 'Phone number must be a valid 10 digit Indian mobile number'
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

const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const registerUser = async (req, res) => {
    try {
        const name = req.body.name?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const phone = normalizePhone(req.body.phone)
        const password = req.body.password

        const validationError = validateAuthInput({ name, email, phone, password }, true, true)
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        const existingPhone = await userModel.findOne({ phone })
        if (existingPhone) {
            return res.status(409).json({ success: false, message: 'Phone number already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            phone,
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
            const duplicateField = Object.keys(error.keyPattern || {})[0]
            return res.status(409).json({
                success: false,
                message: duplicateField === 'phone' ? 'Phone number already registered' : 'Email already registered'
            })
        }

        console.error('Error in registerUser:', error.message)
        res.status(500).json({ success: false, message: 'Registration failed' })
    }
}
const loginUser = async (req, res) => {
    try {
        const identifier = (req.body.identifier ?? req.body.email)?.trim()
        const password = req.body.password

        if (!identifier) {
            return res.status(400).json({ success: false, message: 'Email or mobile number is required' })
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' })
        }

        const query = identifier.includes('@')
            ? { email: identifier.toLowerCase() }
            : { phone: normalizePhone(identifier) }

        if (query.email && !validator.isEmail(query.email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email' })
        }

        if (query.phone && !isValidIndianMobile(query.phone)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid mobile number' })
        }

        const user = await userModel.findOne(query).select('+password')
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
        if (phone !== undefined) {
            const normalizedPhone = normalizePhone(phone)
            const duplicatePhone = normalizedPhone
                ? await userModel.findOne({ phone: normalizedPhone, _id: { $ne: req.userId } })
                : null

            if (duplicatePhone) {
                return res.status(409).json({ success: false, message: 'Phone number already registered' })
            }

            updates.phone = normalizedPhone
        }
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
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Phone number already registered' })
        }

        console.error('Error in updateUserProfile:', error.message)
        res.status(500).json({ success: false, message: 'Failed to update profile' })
    }
}
const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase()

        if (!email || !validator.isEmail(email)) {
            return res.status(200).json({ success: true, message: PASSWORD_RESET_MESSAGE })
        }

        const user = await userModel.findOne({ email })

        if (user) {
            try {
                if (!process.env.FRONTEND_URL) {
                    throw new Error('FRONTEND_URL is not configured')
                }

                const token = createPasswordResetToken(user._id)
                const resetUrl = `${process.env.FRONTEND_URL.replace(/\/$/, '')}/reset-password/${token}`
                const escapedName = escapeHtml(user.name || 'there')
                const escapedResetUrl = escapeHtml(resetUrl)

                await sendEmail({
                    to: email,
                    subject: 'Reset your Good Life Clinic password',
                    text: [
                        `Hello ${user.name || 'there'},`,
                        '',
                        'We received a request to reset your Good Life Clinic password.',
                        `Reset your password using this link: ${resetUrl}`,
                        '',
                        'This link expires in 15 minutes.',
                        'If you did not request this, you can ignore this email.'
                    ].join('\n'),
                    html: [
                        `<p>Hello ${escapedName},</p>`,
                        '<p>We received a request to reset your Good Life Clinic password.</p>',
                        `<p><a href="${escapedResetUrl}">Reset your password</a></p>`,
                        '<p>This link expires in 15 minutes.</p>',
                        '<p>If you did not request this, you can ignore this email.</p>'
                    ].join('')
                })
            } catch (emailError) {
                console.error('Password reset email failed:', emailError.message)
            }
        }

        res.status(200).json({ success: true, message: PASSWORD_RESET_MESSAGE })
    } catch (error) {
        console.error('Error in forgotPassword:', error.message)
        res.status(200).json({ success: true, message: PASSWORD_RESET_MESSAGE })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link' })
        }

        if (!password || typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link' })
        }

        if (decoded.purpose !== 'password-reset' || !decoded.id) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userModel.findByIdAndUpdate(
            decoded.id,
            { $set: { password: hashedPassword } },
            { new: true }
        )

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link' })
        }

        res.status(200).json({ success: true, message: 'Password reset successful' })
    } catch (error) {
        console.error('Error in resetPassword:', error.message)
        res.status(500).json({ success: false, message: 'Failed to reset password' })
    }
}

export { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword }

