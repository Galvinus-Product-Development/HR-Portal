const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt=require('jsonwebtoken');
// Helper to calculate days (you can adapt this as needed)
const calculateDays = (startDate, endDate) => {
	const diffTime = new Date(endDate) - new Date(startDate);
	return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

exports.createLeaveRequest = async (leaveRequestData) => {
	// The leaveRequestData.employeeId comes from the frontend and represents the unique employeeId.
	// Look up the employee using the unique employeeId field.
    // Verify and decode JWT token
    let decoded;
    try {
        decoded = jwt.verify(leaveRequestData.employeeId, process.env.JWT_SECRET);
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

	// Replace the provided employeeId with the actual primary key (employee.id) for the relation.
	leaveRequestData.employeeId = userId;

	return await prisma.leaveRequest.create({
		data: leaveRequestData,
	});
};

exports.getLeaveRequestById = async (id) => {
	return await prisma.leaveRequest.findUnique({
		where: { id },
	});
};

exports.getAllLeaveRequests = async (employeeId) => {
	// If an employeeId (unique field) is provided, translate it to the primary key first.
	if (employeeId) {
		const employee = await prisma.employee.findUnique({
			where: { employeeId },
		});
		if (employee) {
			return await prisma.leaveRequest.findMany({
				where: { employeeId: employee.id },
			});
		} else {
			// If employee is not found, return an empty list.
			return [];
		}
	}
	return await prisma.leaveRequest.findMany();
};

exports.updateLeaveRequest = async (id, updateData) => {
    // Use the UUID directly – no conversion needed!
    if (updateData.status === "APPROVED" || updateData.status === "REJECTED") {
        updateData.decisionAt = new Date();
    }

    // Update the leave request using the UUID id as provided.
    const updatedRequest = await prisma.leaveRequest.update({
        where: { id },
        data: updateData,
    });

    // Process leave history for APPROVED or REJECTED decisions.
    if (updateData.status === "APPROVED") {
        const duration = calculateDays(updatedRequest.startDate, updatedRequest.endDate);
        let paidLeaveIncrement = 0;
        let unpaidLeaveIncrement = 0;

        if (updatedRequest.leaveType === "CASUAL") {
            const casualAggregate = await prisma.leaveHistory.aggregate({
                _sum: { paidLeave: true },
                where: {
                    employeeId: updatedRequest.employeeId,
                    leaveType: "CASUAL",
                    status: "APPROVED",
                },
            });
            const usedCasual = casualAggregate._sum.paidLeave || 0;
            const remainingCasual = Math.max(15 - usedCasual, 0);

            if (duration <= remainingCasual) {
                paidLeaveIncrement = duration;
            } else {
                paidLeaveIncrement = remainingCasual;
                unpaidLeaveIncrement = duration - remainingCasual;
            }
        } else if (updatedRequest.leaveType === "SICK") {
            const sickAggregate = await prisma.leaveHistory.aggregate({
                _sum: { paidLeave: true },
                where: {
                    employeeId: updatedRequest.employeeId,
                    leaveType: "SICK",
                    status: "APPROVED",
                },
            });
            const usedSick = sickAggregate._sum.paidLeave || 0;
            const remainingSick = Math.max(5 - usedSick, 0);

            if (duration <= remainingSick) {
                paidLeaveIncrement = duration;
            } else {
                paidLeaveIncrement = remainingSick;
                unpaidLeaveIncrement = duration - remainingSick;
            }
        } else {
            paidLeaveIncrement = 0;
            unpaidLeaveIncrement = duration;
        }

        const leaveHistoryPayload = {
            employeeId: updatedRequest.employeeId,
            leaveType: updatedRequest.leaveType,
            duration: duration,
            appliedOn: updatedRequest.appliedOn,
            status: updatedRequest.status,
            adminRemarks: updatedRequest.adminRemarks || "",
            supportingDocs: updatedRequest.supportingDocs || null,
            paidLeave: paidLeaveIncrement,
            unpaidLeave: unpaidLeaveIncrement,
        };

        await prisma.leaveHistory.create({
            data: leaveHistoryPayload,
        });
    } else if (updateData.status === "REJECTED") {
        const duration = calculateDays(updatedRequest.startDate, updatedRequest.endDate);
        const leaveHistoryPayload = {
            employeeId: updatedRequest.employeeId,
            leaveType: updatedRequest.leaveType,
            duration: duration,
            appliedOn: updatedRequest.appliedOn,
            status: updatedRequest.status,
            adminRemarks: updatedRequest.adminRemarks || "",
            supportingDocs: updatedRequest.supportingDocs || null,
            paidLeave: 0,
            unpaidLeave: 0,
        };

        await prisma.leaveHistory.create({
            data: leaveHistoryPayload,
        });
    }

    return updatedRequest;
};


exports.deleteLeaveRequest = async (id) => {
	return await prisma.leaveRequest.delete({
		where: { id },
	});
};
