const leaveRequestService = require('../services/leaveRequestService');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.createLeaveRequest = async (req, res) => {
	try {
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
		// const { id } = req.params;
		console.log("I came here inside the getAllLeaveRequests");
		const leaveRequests = await leaveRequestService.getAllLeaveRequests();
		res.status(200).json(leaveRequests);
	} catch (error) {
		console.log("This is the error.....................................................................",error);
		res.status(500).json({ error: error.message });
	}
};

exports.getPendingLeaveRequests = async (req, res) => {
	try {
		// Expect a query parameter employeeId that corresponds to the unique field in Employee.
		const { id } = req.params;
		const leaveRequests = await leaveRequestService.getPendingLeaveRequests(id);
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
		console.log(error);
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


// Get count of employees on leave today
// exports.getOnleaveToday= async (req, res) => {
//     try {

// 		console.log("I came here..................");
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Normalize to start of the day

//         const count = await prisma.leaveRequest.count({
//             where: {
//                 status: 'APPROVED', // Only approved leaves
//                 startDate: { lte: today }, // Leave starts before or on today
//                 endDate: { gte: today } // Leave ends on or after today
//             }
//         });
// 		console.log("this is count.......................................................................",data);
//         return res.status(200).json({ count });

//     } catch (error) {
//         console.error("Error fetching employees on leave today:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// };

exports.getOnleaveToday = async (req, res) => {
    try {
        console.log("I came here..................");

        // Get current date (Year-Month-Date only, ignoring time)
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Fetch all approved leaves for debugging
        const allApprovedLeaves = await prisma.leaveRequest.findMany({
            where: { status: 'APPROVED' }
        });

        // Manual filtering to compare only dates
        const debugLeaves = allApprovedLeaves.filter((leave) => {
            const startDateStr = new Date(leave.startDate).toISOString().split("T")[0];
            const endDateStr = new Date(leave.endDate).toISOString().split("T")[0];

            console.log(`Checking leave ID: ${leave.id}`);
            console.log(`Start Date: ${startDateStr}, End Date: ${endDateStr}`);
            console.log(
                `Condition: ${startDateStr} <= ${todayStr} && ${endDateStr} >= ${todayStr}`
            );

            return startDateStr <= todayStr && endDateStr >= todayStr;
        });


        const count = debugLeaves.length;
        console.log("Leave count:", count);

        return res.status(200).json({ count });

    } catch (error) {
        console.error("Error fetching employees on leave today:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
