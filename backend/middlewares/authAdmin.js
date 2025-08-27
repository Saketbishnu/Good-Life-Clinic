import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        // 1. Get the token from the STANDARD 'Authorization' header
        const authHeader = req.headers['authorization'];

        // 2. Check if the header exists and if it's in the correct "Bearer <token>" format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized, token is missing or malformed' });
        }

        // 3. Extract ONLY the token part from the header string
        const token = authHeader.split(' ')[1];

        // 4. Verify the token using your secret key
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Check if the decoded payload matches the expected string from your login function
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: 'Not Authorized, token is invalid' });
        }

        // If all checks pass, proceed to the next function in the route (e.g., addDoctor)
        next();

    } catch (error) {
        // This catch block will handle errors if the token is expired or has an invalid signature
        console.error("Error in authAdmin middleware:", error.message);
        res.status(401).json({ success: false, message: "Authorization failed. " + error.message });
    }
};

export default authAdmin;