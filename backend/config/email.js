import nodemailer from 'nodemailer'

const createEmailTransporter = () => {
    const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST = 'smtp.gmail.com', EMAIL_PORT, EMAIL_SECURE } = process.env

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
        throw new Error('Email service is not configured')
    }

    const port = EMAIL_PORT ? Number(EMAIL_PORT) : 465
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('EMAIL_PORT must be a valid port number')
    }

    const secure = EMAIL_SECURE === undefined ? port === 465 : EMAIL_SECURE.toLowerCase() === 'true'

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port,
        secure,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000
    })
}

const verifyEmailTransporter = async (transporter) => {
    try {
        await transporter.verify()
        console.log('SMTP connected')
        return true
    } catch (error) {
        console.error('SMTP failed:', error.message)
        return false
    }
}

export default createEmailTransporter
export { verifyEmailTransporter }
