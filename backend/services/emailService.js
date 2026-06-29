const BREVO_EMAIL_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

const getEmailConfig = () => {
    const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } = process.env

    if (!BREVO_API_KEY) {
        throw new Error('BREVO_API_KEY is not configured')
    }

    if (!BREVO_SENDER_EMAIL) {
        throw new Error('BREVO_SENDER_EMAIL is not configured')
    }

    if (!BREVO_SENDER_NAME) {
        throw new Error('BREVO_SENDER_NAME is not configured')
    }

    return { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME }
}

const normalizeRecipients = (to) => {
    if (!to) {
        throw new Error('Email recipient is required')
    }

    const recipients = Array.isArray(to) ? to : [to]

    return recipients.map((recipient) => {
        if (typeof recipient === 'string') {
            return { email: recipient }
        }

        if (recipient?.email) {
            return recipient
        }

        throw new Error('Email recipient must be an email string or recipient object')
    })
}

const readBrevoError = async (response) => {
    const responseText = await response.text()

    if (!responseText) {
        return `Brevo email request failed with status ${response.status}`
    }

    try {
        const errorBody = JSON.parse(responseText)
        return errorBody.message || errorBody.error || responseText
    } catch {
        return responseText
    }
}

const sendEmail = async ({ to, subject, text, html }) => {
    const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } = getEmailConfig()

    if (!subject) {
        throw new Error('Email subject is required')
    }

    if (!text && !html) {
        throw new Error('Email text or html content is required')
    }

    const payload = {
        sender: {
            email: BREVO_SENDER_EMAIL,
            name: BREVO_SENDER_NAME
        },
        to: normalizeRecipients(to),
        subject
    }

    if (text) {
        payload.textContent = text
    }

    if (html) {
        payload.htmlContent = html
    }

    const response = await fetch(BREVO_EMAIL_ENDPOINT, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const brevoError = await readBrevoError(response)
        throw new Error(`Brevo email failed: ${brevoError}`)
    }

    return response.json()
}

export { sendEmail }
