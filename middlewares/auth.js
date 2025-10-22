// middlewares/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use a strong, randomly generated secret in production

// Create JWT
function createJWT(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Verify JWT
function verifyJWT(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null; // Token is invalid or expired
    }
}

// Middleware to protect routes
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
}

export { createJWT, verifyJWT, authMiddleware };