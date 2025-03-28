const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


require("dotenv").config(); // Load environment variables
const axios = require("axios");

exports.getLeaveBalance = async (employeeId) => {
    try {
        // Fetch employee from Employee Microservice
        const employeeServiceUrl = `${process.env.EMPLOYEE_SERVICE_URL}/${employeeId}`;
        const { data: employee } = await axios.get(employeeServiceUrl);

        if (!employee) {
            throw new Error("Employee not found");
        }

        // Calculate Casual Leave Balance
        const casualAggregate = await prisma.leaveHistory.aggregate({
            _sum: { paidLeave: true },
            where: {
                employeeId: employee.id, // Use ID from Employee Microservice
                leaveType: "CASUAL",
                status: "APPROVED",
            },
        });
        const usedCasual = casualAggregate._sum.paidLeave || 0;
        const casualBalance = Math.max(15 - usedCasual, 0);

        // Calculate Sick Leave Balance
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

        // Calculate Compensation Leave Balance
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
    } catch (error) {
        console.error("Error fetching leave balance:", error);
        throw new Error("Failed to fetch leave balance.");
    }
};



// exports.getLeaveBalance = async (employeeId) => {
// 	// Find employee by the unique employeeId (from localStorage)
// 	const employee = await prisma.employee.findUnique({
// 		where: { employeeId },
// 	});
// 	console.log(employee);
// 	if (!employee) {
// 		throw new Error("Employee not found");
// 	}

// 	// Calculate Casual Leave: total APPROVED casual leave days taken
// 	const casualAggregate = await prisma.leaveHistory.aggregate({
// 		_sum: { paidLeave: true },
// 		where: {
// 			employeeId: employee.id,
// 			leaveType: "CASUAL",
// 			status: "APPROVED",
// 		},
// 	});
// 	const usedCasual = casualAggregate._sum.paidLeave || 0;
// 	const casualBalance = Math.max(15 - usedCasual, 0);

// 	// Calculate Sick Leave: total APPROVED sick leave days taken
// 	const sickAggregate = await prisma.leaveHistory.aggregate({
// 		_sum: { paidLeave: true },
// 		where: {
// 			employeeId: employee.employeeId,
// 			leaveType: "SICK",
// 			status: "APPROVED",
// 		},
// 	});
// 	const usedSick = sickAggregate._sum.paidLeave || 0;
// 	const sickBalance = Math.max(5 - usedSick, 0);

// 	// Calculate Compensation Leave: sum of durations for APPROVED compensatory leaves
// 	const compensatoryAggregate = await prisma.leaveHistory.aggregate({
// 		_sum: { duration: true },
// 		where: {
// 			employeeId: employee.employeeId,
// 			leaveType: "COMPENSATORY",
// 			status: "APPROVED",
// 		},
// 	});
// 	const totalCompensatoryTaken = compensatoryAggregate._sum.duration || 0;

// 	return {
// 		casualBalance,
// 		sickBalance,
// 		totalCompensatoryTaken,
// 	};
// };
