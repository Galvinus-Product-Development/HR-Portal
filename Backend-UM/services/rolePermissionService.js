const prisma = require("../models/prisma/prismaClient");

// Fetch all employees with roles
const getEmployees = async () => {
  try {
    const employees = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role.name,
      avatar: emp.profilePicture || "https://default-avatar-url.com",
      department: 'Engineering',
      // role: 'Employee',
    }));
  } catch (error) {
    throw new Error("Error fetching employees: " + error.message);
  }
};

// Fetch all roles with their permissions

const getRoles = async () => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id:true,
        name: true,
        rolePermissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    const formattedRoles = {};
    roles.forEach((role) => {
      formattedRoles[role.name] = {
        role: role.name,
        roleId:role.id,
        permissions: role.rolePermissions.map((rp) => ({
          id: rp.permission.id,
          name: rp.permission.name,
        })),
      };
    });

    return formattedRoles;
  } catch (error) {
    throw new Error("Error fetching roles: " + error.message);
  }
};

const getPermissions = async () => {
  try {
    const permissions = await prisma.permission.findMany();

    // Add hardcoded module and format the response
    return permissions.map(permission => ({
      ...permission,
      module: 'employees', // Hardcoded module
      actions: ['view']    // Hardcoded actions
    }));
  } catch (error) {
    throw new Error("Error fetching permissions: " + error.message);
  }
};


const removeRolePermission = async (roleId, permissionId) => {
    try {
        const rolePermission = await prisma.rolePermission.findFirst({
            where: { roleId, permissionId },
        });

        if (!rolePermission) {
            return null;
        }

        await prisma.rolePermission.delete({
            where: { id: rolePermission.id },
        });

        return true;
    } catch (error) {
        console.error("Error in removeRolePermission service:", error);
        throw error;
    }
};


module.exports = { getEmployees, getRoles, getPermissions ,removeRolePermission};
