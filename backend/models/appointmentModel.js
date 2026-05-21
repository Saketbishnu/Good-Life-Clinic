import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    amount: { type: Number, required: true },
    userData: { type: Object, required: true },
    doctorData: { type: Object, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    date: { type: Number, default: Date.now }
}, { minimize: false })

appointmentSchema.index(
    { doctorId: 1, slotDate: 1, slotTime: 1 },
    { unique: true, partialFilterExpression: { cancelled: false } }
)
appointmentSchema.index({ userId: 1, date: -1 })

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel
