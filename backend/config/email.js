import nodemailer from 'nodemailer'

const createEmailTransporter = () => {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_SECURE } = process.env

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
        throw new Error('Email service is not configured')
    }

    const port = Number(EMAIL_PORT)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('EMAIL_PORT must be a valid port number')
    }

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port,
        secure: EMAIL_SECURE === "true",
        requireTLS: !(
            EMAIL_SECURE === "true"
        ),
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        },
        tls: {
            minVersion: "TLSv1.2"
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000
    })
}

const verifyEmailTransporter = async (transporter) => {
    try {
        await transporter.verify()
        console.log('SMTP verified successfully')
        return true
    } catch (error) {
        console.error('SMTP verification failed:', error.message)
        return false
    }
}

export default createEmailTransporter
export { verifyEmailTransporter }
