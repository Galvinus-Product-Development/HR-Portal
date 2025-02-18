const prisma = require("../models/prisma/prismaClient");

const checkPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Fetch user's roles and their permissions
      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
      });

      const userPermissions = userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.name)
      );

      // Check if user has the required permission
      const hasPermission = permissions.some((perm) => userPermissions.includes(perm));

      if (!hasPermission) {
        return res.status(403).json({ message: "Access denied: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error in permission middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = checkPermission;
