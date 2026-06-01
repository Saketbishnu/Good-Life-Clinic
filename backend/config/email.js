import nodemailer from 'nodemailer'

const createEmailTransporter = () => {
    const { EMAIL_USER, EMAIL_PASSWORD } = process.env

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
        throw new Error('Email service is not configured')
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    })
}

export default createEmailTransporter
