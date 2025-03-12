const employeeService = require('../services/employeeService');

exports.addEmployee = async (req, res) => {
    try {
        const data = await employeeService.addEmployee(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const data = await employeeService.getAllEmployees();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Employee by ID
exports.getEmployee = async (req, res) => {
    try {
        const data = await employeeService.getEmployee(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const data = await employeeService.updateEmployee(req.params.id, req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await employeeService.deleteEmployee(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
