const salaryService = require("../services/salaryService");

exports.createSalary = async (req, res) => {
  try {
    const salary = await salaryService.createSalary(req.body);
    res.status(201).json({ success: true, data: salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await salaryService.getAllSalaries();
    res.status(200).json({ success: true, data: salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalaryById = async (req, res) => {
  try {
    const salary = await salaryService.getSalaryById(req.params.id);
    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    res.status(200).json({ success: true, data: salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const updatedSalary = await salaryService.updateSalary(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedSalary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    await salaryService.deleteSalary(req.params.id);
    res.status(200).json({ success: true, message: "Salary record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
