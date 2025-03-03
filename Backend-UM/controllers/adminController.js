const { assignRole, assignRolePermission } = require("../services/roleService");
const adminService = require("../services/adminService");
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


/**
 * Sends a registration link to an admin email.
 */
exports.sendRegistrationLink = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await adminService.sendRegistrationLink(email);
    res.status(200).json({ message: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Completes the registration using the token.
 */
exports.completeRegistration = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;
    console.log(token);
    const result = await adminService.completeRegistration(token, name, password);
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await adminService.deleteUserByEmail(email);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};