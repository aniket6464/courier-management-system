import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// Middleware to verify JWT token and role
export const verifyToken = (roles) => (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, 'Unauthorized'));

  // Verify the token using the JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    // Extract id and type (role) from decoded token
    const { id, type } = decoded;
    req.userId = id;
    req.userRole = type ? 'Admin' : 'Staff'; // Map the type to a user role

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.userRole)) {
      return next(errorHandler(403, 'Access Denied.'));
    }

    // Proceed to the next middleware or route handler
    next();
  });
};
