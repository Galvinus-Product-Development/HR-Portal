const employeeService = require("../services/employeeService");
const jwt = require("jsonwebtoken");

exports.createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFormattedEmployees = async (req, res) => {
  try {
    console.log("asdhfkjashkfahfkdskfkahd");
    const employees = await employeeService.getFormattedEmployees();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.fetchEmployeeDetailsById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employeeData = await employeeService.fetchEmployeeDetailsById(
      employeeId
    );

    if (!employeeData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employeeData);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.submitPersonalDetails = async (req, res) => {
  try {
    const response = await employeeService.createPersonalDetails(req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAllEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEmployee = await employeeService.updateAllEmployeeDetails(
      id,
      req.body
    );

    res
      .status(200)
      .json({
        message: "Employee details updated successfully",
        updatedEmployee,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await employeeService.updateApprovalStatus(
      id,
      req.body.approvalStatus
    );

    res
      .status(200)
      .json({
        message: "Employee details updated successfully",
        updatedEmployee,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to handle employment details request
exports.getEmploymentDetails = async (req, res) => {
  try {
    const { userId } = req.params; // Extracted from JWT in middleware

    // Verify and decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(userId, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      return { status: 401, data: { error: "Unauthorized: Invalid token" } };
    }

    const userID = decoded.userId; // Extract userId from token payload

    if (!userId) {
      return {
        status: 401,
        data: { error: "Unauthorized: Invalid user ID in token" },
      };
    }
    console.log(userID);
    const employmentDetails = await employeeService.getEmploymentByUserId(
      userID
    );

    if (!employmentDetails) {
      return res.status(404).json({ error: "Employment details not found" });
    }

    res.json(employmentDetails);
  } catch (error) {
    console.error("Error fetching employment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getBankDetails = async (req, res) => {

    try {

      const { userId } = req.params; // Extracted from JWT in middleware

      // Verify and decode JWT token
      let decoded;
      try {
        decoded = jwt.verify(userId, process.env.JWT_SECRET);
      } catch (error) {
        console.log(error);
        return { status: 401, data: { error: "Unauthorized: Invalid token" } };
      }
  
      const userID = decoded.userId; // Extract userId from token payload
  
      if (!userId) {
        return {
          status: 401,
          data: { error: "Unauthorized: Invalid user ID in token" },
        };
      }
        const bankDetails = await employeeService.getBankDetailsByEmployeeId(userID);

        if (!bankDetails) {
            return res.status(404).json({ message: "Bank details not found" });
        }

        res.json({
            accountHolderName: bankDetails.account_holder_name,
            bankName: bankDetails.bank_name,
            accountNumber: bankDetails.account_number,
            ifscCode: bankDetails.ifsc_code,
            accountStatus: "Active", // Modify if needed
        });
    } catch (error) {
        console.error("Error fetching bank details:", error);
        res.status(500).json({ message: "Error fetching bank details" });
    }
};
