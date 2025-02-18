// const prisma = require("../models/prisma/prismaClient"); // Import Prisma client

// const checkRole = (roles) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.userId; // Assuming the user is already authenticated and stored in req.user

//       // Fetch the user's role
//       const user = await prisma.user.findUnique({
//         where: { id: userId },
//         select: { role: true }, // Fetch only the role
//       });

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Check if the user's role is included in the allowed roles
//       if (!roles.includes(user.role)) {
//         return res.status(403).json({ message: "Access denied: Insufficient permissions" });
//       }

//       next();
//     } catch (error) {
//       console.error("Error in role middleware:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };
// };

// module.exports = checkRole;

const prisma = require("../models/prisma/prismaClient"); // Import Prisma client

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId; // Assuming the user is already authenticated and stored in req.userId

      // Fetch the user's role by joining with the Role table
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: { select: { name: true } } }, // Get the role name from the Role table
      });

      if (!user || !user.role) {
        return res.status(404).json({ message: "User or role not found" });
      }

      const userRole = user.role.name; // Extract the role name

      // Check if the user's role is in the allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied: Insufficient permissions" });
      }

      next(); // User has the required role, proceed to the next middleware
    } catch (error) {
      console.error("Error in role middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = checkRole;

