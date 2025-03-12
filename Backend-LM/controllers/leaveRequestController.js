const leaveRequestService = require('../services/leaveRequestService');
const jwt=require("jsonwebtoken");
exports.createLeaveRequest = async (req, res) => {
	try {
		// req.body includes employeeId (as the unique field from localStorage) along with other leave details.
		const leaveRequestData = req.body;
		const newLeaveRequest = await leaveRequestService.createLeaveRequest(leaveRequestData);
		res.status(201).json(newLeaveRequest);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getLeaveRequestById = async (req, res) => {
	try {
		const { id } = req.params;
		const leaveRequest = await leaveRequestService.getLeaveRequestById(id);
		if (!leaveRequest) {
			return res.status(404).json({ error: "Leave request not found" });
		}
		res.status(200).json(leaveRequest);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getAllLeaveRequests = async (req, res) => {
	try {
		// Expect a query parameter employeeId that corresponds to the unique field in Employee.
		const { employeeId } = req.query;

		// Verify and decode JWT token
		let decoded;
		try {
			decoded = jwt.verify(employeeId, process.env.JWT_SECRET);
		} catch (error) {
			console.log(error);
			return { status: 401, data: { error: "Unauthorized: Invalid token" } };
		}
	
		const userId = decoded.userId; // Extract userId from token payload
	
		if (!userId) {
			return {
			status: 401,
			data: { error: "Unauthorized: Invalid user ID in token" },
			};
		}


		const leaveRequests = await leaveRequestService.getAllLeaveRequests(userId);
		res.status(200).json(leaveRequests);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateLeaveRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedLeaveRequest = await leaveRequestService.updateLeaveRequest(id, updateData);
		res.status(200).json(updatedLeaveRequest);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteLeaveRequest = async (req, res) => {
	try {
		const { id } = req.params;
		await leaveRequestService.deleteLeaveRequest(id);
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
