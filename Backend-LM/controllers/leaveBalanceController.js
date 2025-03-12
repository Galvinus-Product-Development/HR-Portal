const leaveBalanceService = require('../services/leaveBalanceService');
const jwt=require("jsonwebtoken");
exports.getLeaveBalance = async (req, res) => {
	try {
		const { employeeId } = req.params;
        // Verify and decode JWT token
        console.log("I am here",employeeId);
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

		const balance = await leaveBalanceService.getLeaveBalance(userId);
		res.status(200).json(balance);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
