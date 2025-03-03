// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to extract and verify JWT from the authorization header
function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
  
  if (!token) {
    console.log("Here>>>>>>>>>>>>>>>>>>>>")
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to the request object
    req.decoded=decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}


const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (req.decoded.roleName === "SUPER_ADMIN") {
        return next();
      }

      // Check if user has the required permission
      console.log(req.decoded.permissions);
      if (!req.decoded.permissions || !req.decoded.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next(); // User has permission, proceed
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
};


module.exports = { authenticate, checkPermission };