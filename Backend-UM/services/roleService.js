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




/**
 * Create a new role
 */
exports.createRole = async (name, description) => {
  return await prisma.role.create({
    data: {
      name,
      description,
    },
  });
};

/**
 * Delete a role by ID
 */
exports.deleteRole = async (roleId) => {
  try {
    // Fetch the role details first
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error("Role not found.");
    }

    // Prevent deletion of Super Admin role
    if (role.name.toLowerCase() === "super_admin") {
      throw new Error("Super Admin role cannot be deleted.");
    }

    // First, delete role permissions associated with this role
    await prisma.rolePermission.deleteMany({
      where: { roleId: roleId },
    });

    // Then, delete the role itself
    const deletedRole = await prisma.role.delete({
      where: { id: roleId },
    });

    return deletedRole;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw new Error(error.message || "Failed to delete role. Ensure it has no dependencies.");
  }
};


/**
 * Create a new permission
 */
exports.createPermission = async (name, description) => {
  return await prisma.permission.create({
    data: {
      name,
      description,
    },
  });
};

/**
 * Delete a permission by ID
 */
exports.deletePermission = async (permissionId) => {
  return await prisma.permission.delete({
    where: { id: permissionId },
  });
};
