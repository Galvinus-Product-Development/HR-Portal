const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getLeaveBalance = async (employeeUniqueId) => {
	// Find employee by the unique employeeId (from localStorage)
	const employee = await prisma.employee.findUnique({
		where: { employeeId: employeeUniqueId },
	});
	if (!employee) {
		throw new Error("Employee not found");
	}

	// Calculate Casual Leave: total approved casual leave days taken
	const casualAggregate = await prisma.leaveHistory.aggregate({
		_sum: { paidLeave: true },
		where: {
			employeeId: employee.id,
			leaveType: "CASUAL",
			status: "APPROVED",
		},
	});
	const usedCasual = casualAggregate._sum.paidLeave || 0;
	const casualBalance = Math.max(15 - usedCasual, 0);

	// Calculate Sick Leave: total approved sick leave days taken
	const sickAggregate = await prisma.leaveHistory.aggregate({
		_sum: { paidLeave: true },
		where: {
			employeeId: employee.id,
			leaveType: "SICK",
			status: "APPROVED",
		},
	});
	const usedSick = sickAggregate._sum.paidLeave || 0;
	const sickBalance = Math.max(5 - usedSick, 0);

	// Calculate Compensation Leave: sum of durations for approved compensatory leaves
	const compensatoryAggregate = await prisma.leaveHistory.aggregate({
		_sum: { duration: true },
		where: {
			employeeId: employee.id,
			leaveType: "COMPENSATORY",
			status: "APPROVED",
		},
	});
	const totalCompensatoryTaken = compensatoryAggregate._sum.duration || 0;

	return {
		casualBalance,
		sickBalance,
		totalCompensatoryTaken,
	};
};
