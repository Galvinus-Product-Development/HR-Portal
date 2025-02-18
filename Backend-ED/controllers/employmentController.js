const employmentService = require("../services/employmentService");

exports.createEmployment = async (req, res) => {
  try {
    const employment = await employmentService.createEmployment(req.body);
    res.status(201).json({ success: true, data: employment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllEmployments = async (req, res) => {
  try {
    const employments = await employmentService.getAllEmployments();
    res.status(200).json({ success: true, data: employments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmploymentById = async (req, res) => {
  try {
    const employment = await employmentService.getEmploymentById(req.params.id);
    if (!employment) {
      return res.status(404).json({ success: false, message: "Employment record not found" });
    }
    res.status(200).json({ success: true, data: employment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEmployment = async (req, res) => {
  try {
    const updatedEmployment = await employmentService.updateEmployment(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedEmployment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEmployment = async (req, res) => {
  try {
    await employmentService.deleteEmployment(req.params.id);
    res.status(200).json({ success: true, message: "Employment record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
