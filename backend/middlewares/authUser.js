import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized, token is missing or malformed' })
        }

        const token = authHeader.split(' ')[1]

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: 'JWT_SECRET is not configured' })
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (!tokenDecode?.id) {
            return res.status(401).json({ success: false, message: 'Not authorized, token is invalid' })
        }

        req.userId = tokenDecode.id
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Authorization failed. ' + error.message })
    }
}

export default authUser
