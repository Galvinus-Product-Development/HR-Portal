const prisma = require("../models/prisma/prismaClient");


exports.assignRole = async (userId, roleName) => {
  // Validate role exists
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error("Role does not exist");
  }

  // Update user's role by setting `roleId`
  await prisma.user.update({
    where: { id: userId },
    data: { roleId: role.id }, 
  });

  return `Role '${roleName}' assigned successfully to user '${userId}'`;
};


exports.assignRolePermission = async (roleName, permissionName) => {
  // Get role
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error("Role does not exist");
  }

  // Get permission
  const permission = await prisma.permission.findUnique({
    where: { name: permissionName },
  });

  if (!permission) {
    throw new Error("Permission does not exist");
  }

  // Check if already assigned
  const existingRolePermission = await prisma.rolePermission.findFirst({
    where: { roleId: role.id, permissionId: permission.id },
  });

  if (existingRolePermission) {
    throw new Error("Permission already assigned to role");
  }

  // Assign permission to role
  await prisma.rolePermission.create({
    data: {
      roleId: role.id,
      permissionId: permission.id,
    },
  });

  return `Permission '${permissionName}' assigned to role '${roleName}'`;
};
