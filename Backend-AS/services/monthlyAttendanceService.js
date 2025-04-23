const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllMonthlyAttendance = async () => {
	return await prisma.monthlyAttendanceStats.findMany();
}

exports.getMonthlyAttendanceById = async (employeeId, year, month) => {
	console.log(employeeId);
	return await prisma.monthlyAttendanceStats.findUnique({
		where: {
			employeeId_monthYear: {
				employeeId: employeeId,
				monthYear: `${year}-${month}`,
			}
		},
	});
}

exports.addMonthlyAttendance = async (attendanceData) => {
	return await prisma.monthlyAttendanceStats.create({ data: attendanceData });
}

exports.updateMonthlyAttendance = async (employeeId, updateData, year, month) => {
	return await prisma.monthlyAttendanceStats.update({
		where: {
			employeeId_monthYear: {
				employeeId: employeeId,
				monthYear: `${year}-${month}`,
			}
		},
		data: updateData,
	});
}

exports.updateMonthlyAbsentDays = async (employeeId, absentDays, year, month) => {
	return await prisma.monthlyAttendanceStats.update({
		where: {
			employeeId_monthYear: {
				employeeId: employeeId,
				monthYear: `${year}-${month}`,
			}
		},
		data: {
			absentDays: absentDays
		},
	});
}

exports.deleteMonthlyAttendance = async (id) => {
	return await prisma.monthlyAttendanceStats.delete({ where: { id } });
}