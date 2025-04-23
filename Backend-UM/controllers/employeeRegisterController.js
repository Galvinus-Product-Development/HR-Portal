const { handleEmployeeRegistration } = require("../services/employeeRegisterService");

exports.registerEmployeeUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const userId = await handleEmployeeRegistration({ name, email, password });
    res.status(201).json({ userId });
  } catch (error) {
    console.error("Error registering employee user:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
