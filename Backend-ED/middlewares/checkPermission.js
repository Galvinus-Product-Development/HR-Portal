const jwt = require("jsonwebtoken");

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      console.log(req.headers['authorization']?.split(' ')[1]);
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Here..............",authHeader);
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // Store user info in request object for later use
      console.log("This is docoded",decoded);
      // Skip permission check for SUPER_ADMIN or ADMIN
      if (decoded.roleName === "SUPER_ADMIN") {
        return next(); // Allow access immediately
      }

      // Check if user has the required permission
      if (!decoded.permissions || !decoded.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next(); // User has permission, proceed
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
};

module.exports = checkPermission;
