const leaveBalanceService = require('../services/leaveBalanceService');

exports.getLeaveBalance = async (req, res) => {
	try {
		const { employeeId } = req.query;
		if (!employeeId) {
			return res.status(400).json({ error: "Employee id is required" });
		}
		const balance = await leaveBalanceService.getLeaveBalance(employeeId);
		res.status(200).json(balance);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
