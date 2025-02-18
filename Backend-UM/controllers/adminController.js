const { assignRole, assignRolePermission } = require("../services/roleService");

exports.assignRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    const message = await assignRole(userId, roleName);
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.assignRolePermission = async (req, res) => {
  try {
    const { roleName, permissionName } = req.body;
    const message = await assignRolePermission(roleName, permissionName);
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error assigning permission:", error);
    res.status(400).json({ message: error.message });
  }
};
