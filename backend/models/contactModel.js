import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    emailSent: { type: Boolean, default: false },
    date: { type: Number, default: Date.now }
})

const contactModel = mongoose.models.contact || mongoose.model('contact', contactSchema)

export default contactModel
