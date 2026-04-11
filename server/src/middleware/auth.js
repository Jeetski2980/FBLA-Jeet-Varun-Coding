import jwt from 'jsonwebtoken';

// Get secret from environment variables, or use fallback if not set
const JWT_SECRET = process.env.JWT_SECRET || 'locals-loop-secret-key';

// Function to generate token for a user
export function generateToken(user) {
  return jwt.sign(
    // Payload: user data stored in the token
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET, // Secret key used to sign the token
  );
}

// Middleware to verify  token from cookies
export function verifyToken(req, res, next) { // Check the auth cookie
  const token = req.cookies.token; // Get token from cookies

  // If no token is provided, return unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // Verify token using secret
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request
    next(); // Move to next middleware or route
  } catch (error) {
    // If token is invalid or expired, return unauthorized
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// Middleware to restrict access to admin users only
export function isAdmin(req, res, next) { // Limit access to admins
  // Check if user exists and has ADMIN role
  if (req.user && req.user.role === 'ADMIN') {
    next(); // Allow access
  } else {
    // If not admin, return forbidden
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
}