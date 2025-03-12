const leaveHistoryService = require('../services/leaveHistoryService');

exports.getAllLeaveHistory = async (req, res) => {
    try {
        // Extract query parameters (year, month, status) from the request
        const data = await leaveHistoryService.getAllLeaveHistory(req.query);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLeaveHistoryById = async (req, res) => {
    try {
        const data = await leaveHistoryService.getLeaveHistoryById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeLeaveHistoryForMonth = async (req, res) => {
    const { employeeId, year, month } = req.params;
    
    if (!employeeId) {
        return res.status(400).json({ error: "Employee ID is required." });
    }

    try {
        const data = await leaveHistoryService.getEmployeeLeaveHistoryForMonth(employeeId, year, month);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching leave history for month:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createLeaveHistory = async (req, res) => {
    try {
        const data = await leaveHistoryService.createLeaveHistory(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLeaveHistory = async (req, res) => {
    try {
        const data = await leaveHistoryService.updateLeaveHistory(req.params.id, req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteLeaveHistory = async (req, res) => {
    try {
        await leaveHistoryService.deleteLeaveHistory(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
