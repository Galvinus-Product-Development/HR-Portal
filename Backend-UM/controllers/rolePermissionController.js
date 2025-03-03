const { getEmployees, getRoles, getPermissions ,removeRolePermission} = require("../services/rolePermissionService");
const { createRole, deleteRole, createPermission, deletePermission } = require("../services/roleService.js");
// Controller to get employees
exports.fetchEmployees = async (req, res) => {
  try { 
    const employees = await getEmployees();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to get roles
exports.fetchRoles = async (req, res) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to get permissions
exports.fetchPermissions = async (req, res) => {
  try {
    const permissions = await getPermissions();
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Server error" });
  }
};




/**
 * Controller to create a new role
 */
exports.createRoleController = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Role name is required" });

    const newRole = await createRole(name, description);
    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ message: "Error creating role", error: error.message });
  }
};

/**
 * Controller to delete a role
 */
exports.deleteRoleController = async (req, res) => {
  try {
    const { roleId } = req.params;

    await deleteRole(roleId);
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};

/**
 * Controller to create a new permission
 */
exports.createPermissionController = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Permission name is required" });

    const newPermission = await createPermission(name, description);
    return res.status(201).json(newPermission);
  } catch (error) {
    return res.status(500).json({ message: "Error creating permission", error: error.message });
  }
};

/**
 * Controller to delete a permission
 */
exports.deletePermissionController = async (req, res) => {
  try {
    const { permissionId } = req.params;

    await deletePermission(permissionId);
    return res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting permission", error: error.message });
  }
};




exports.removeRolePermission = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;

        if (!roleId || !permissionId) {
            return res.status(400).json({ message: "Role ID and Permission ID are required." });
        }

        const result = await removeRolePermission(roleId, permissionId);

        if (!result) {
            return res.status(404).json({ message: "Role or Permission not found or not assigned." });
        }

        return res.status(200).json({ message: "Permission removed from role successfully." });
    } catch (error) {
        console.error("Error removing role permission:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

