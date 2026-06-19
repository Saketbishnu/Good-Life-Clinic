import validator from 'validator'
import contactModel from '../models/contactModel.js'
import createEmailTransporter, { verifyEmailTransporter } from '../config/email.js'

const validateContactInput = ({ name, email, message }) => {
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
        return 'Name must be between 2 and 80 characters'
    }

    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
        return 'Please enter a valid email'
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
        return 'Message must be between 10 and 2000 characters'
    }

    return null
}

const sendContactMessage = async (req, res) => {
    try {
        const name = req.body.name?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const message = req.body.message?.trim()

        const validationError = validateContactInput({ name, email, message })
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError })
        }

        const contactMessage = await contactModel.create({ name, email, message })
        const submittedAt = new Date(contactMessage.date).toISOString()

        try {
            if (!process.env.CONTACT_RECEIVER_EMAIL || !validator.isEmail(process.env.CONTACT_RECEIVER_EMAIL)) {
                throw new Error('Contact receiver email is not configured')
            }

            const transporter = createEmailTransporter()
            if (!await verifyEmailTransporter(transporter)) {
                throw new Error('SMTP verification failed')
            }

            await transporter.sendMail({
                from: `"Good Life Clinic Contact" <${process.env.EMAIL_USER}>`,
                to: process.env.CONTACT_RECEIVER_EMAIL,
                replyTo: email,
                subject: `New contact message from ${name}`,
                text: [
                    `Sender name: ${name}`,
                    `Sender email: ${email}`,
                    `Submitted at: ${submittedAt}`,
                    '',
                    'Message:',
                    message
                ].join('\n')
            })

            contactMessage.emailSent = true
            await contactMessage.save()
            console.log(`Email sent for contact message ${contactMessage._id}`)
        } catch (emailError) {
            contactMessage.emailSent = false
            await contactMessage.save()
            console.error(`Email send failed for contact message ${contactMessage._id}:`, emailError.message)
        }

        res.status(200).json({
            success: true,
            message: 'Your inquiry has been received'
        })
    } catch (error) {
        console.error('Error in sendContactMessage:', error.message)
        res.status(500).json({ success: false, message: 'Failed to send message' })
    }
}

export { sendContactMessage }
