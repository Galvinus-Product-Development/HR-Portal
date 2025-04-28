const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const updateMonthlyAttendance = require('../utils/updateMonthlyAttendance');

exports.createAttendanceRequest = async (attendanceRequestData) => {
	const {
		employeeId,
		requestDate,
		attendanceDate,
		punchInTime,
		punchOutTime,
		reason
	} = attendanceRequestData;

	console.log(requestDate, " ", attendanceDate, " ", punchInTime, " ", punchOutTime);

	// Check if both punchInTime and punchOutTime are provided
	if (punchInTime && punchOutTime) {
		throw new Error('Both punchInTime and punchOutTime are not allowed. Give only one of them');
	}

	// Get today's date at midnight
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Set the lower limit: 7 days ago
	const minAllowedDate = new Date();
	minAllowedDate.setDate(today.getDate() - 7);
	minAllowedDate.setHours(0, 0, 0, 0);

	if (attendanceDate) {
		const attendanceDateObj = new Date(attendanceDate);
		attendanceDateObj.setHours(0, 0, 0, 0); // Normalize for fair comparison
	
		// Future date check (already in your code, just moved here for clarity)
		if (attendanceDateObj > today) {
			throw new Error('Attendance date cannot be in the future');
		}
	
		// Too old date check
		if (attendanceDateObj < minAllowedDate) {
			throw new Error('Attendance date must be within the last 7 days');
		}
	}

	// Fetch the employee along with their attendance records
	const employee = await prisma.employee.findUnique({
		where: { id: employeeId },
		include: { attendance: true } // <-- include attendance array
	});

	if (!employee) {
		throw new Error('Employee not found');
	}

	if (attendanceDate) {
		const attendanceDateObj = new Date(attendanceDate);
		attendanceDateObj.setHours(0, 0, 0, 0); // Normalize
	
		const hasAttendance = employee.attendance.some(att => {
			const attDate = new Date(att.date); // assuming `att.date` is the attendance date
			attDate.setHours(0, 0, 0, 0);
			return attDate.getTime() === attendanceDateObj.getTime();
		});
	
		if (!hasAttendance) {
			throw new Error('Attendance record does not exist for the selected date');
		}
	}

	// Check if the request already exists
	const existingRequest = await prisma.attendanceRequest.findFirst({
		where: {
			employeeId: employeeId,
			requestDate: requestDate
		},
	});

	if (existingRequest) {
		throw new Error('Attendance request already exists for this date');
	}

	const attendanceRequest = await prisma.attendanceRequest.create({
		data: {
			employeeId: employeeId,
			requestDate: requestDate ? new Date(requestDate) : null,
			attendanceDate: attendanceDate? new Date(attendanceDate): null,
			punchInTime: punchInTime ? new Date(punchInTime) : null,
			punchOutTime: punchOutTime ? new Date(punchOutTime) : null,
			reason: reason,
			status: "Pending",
		},
	});







  try {
	const employeeResponse = await axios.get(
	  `${process.env.EMPLOYEE_SERVICE_URLL}/${employeeId}`
	);
	const employee = employeeResponse.data;

	const lineManagerUserId = employee?.employmentDetails?.lineManagerId;

	if (!lineManagerUserId) {
	  console.warn("Line manager not found for employee:", employeeId);
	}

	await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
	  userIds: [lineManagerUserId],
	  title: "New attendance Request Submitted",
	  message: `Employee ${employee?.personalDetails?.name} has submitted an attendance request.`,
	  priority: "NORMAL",
	  redirectUrl: `${process.env.APP_URL}/attendance/request`,
	  recipientType: "ADMIN",
	});
	console.log("Notification sent successfully!!!");
  } catch (e) {
	console.log("error in the notification", e);
	throw new Error(e);
  }









	return attendanceRequest;
}

exports.getAllAttendanceRequests = async () => {
	return await prisma.employee.findMany({ include: { attendanceRequest: true } });
}








exports.updateAttendanceRequest = async (id, updateData) => {
	const {
		employeeId,
		attendanceDate,
		punchInTime,
		punchOutTime,
		status,
	} = updateData;

	console.log(attendanceDate, punchInTime, punchOutTime);

	const attendanceRequest = await prisma.attendanceRequest.findUnique({
		where: { id },
	});

	if (!attendanceRequest) {
		throw new Error('Attendance request not found');
	}

	if (updateData.punchInTime && updateData.punchOutTime) {
		throw new Error('Both punchInTime and punchOutTime are not allowed. Give only one of them');
	}

	if (status === 'Approved') {
		let attendanceResult;

		// Define date range for the whole day
		const start = new Date(attendanceDate);
		start.setUTCHours(0, 0, 0, 0);

		const end = new Date(attendanceDate);
		end.setUTCHours(23, 59, 59, 999);

		// First, fetch the attendance record for that date
		const existingAttendance = await prisma.attendance.findFirst({
			where: {
				employeeId: employeeId,
				date: {
					gte: start,
					lte: end,
				},
			},
		});

		if (!existingAttendance) {
			throw new Error('Attendance record not found for the given date.');
		}

		// Then, update by ID (safer than composite unique match)
		if (punchInTime) {
			attendanceResult = await prisma.attendance.update({
				where: { id: existingAttendance.id },
				data: {
					punchInTime: punchInTime ?? null,
				},
			});
		} else if (punchOutTime) {
			attendanceResult = await prisma.attendance.update({
				where: { id: existingAttendance.id },
				data: {
					punchOutTime: punchOutTime ?? null,
				},
			});
			console.log("Punch-out time updated.");
		}

		if (!attendanceResult) {
			throw new Error('Failed to update attendance record');
		}

		const monthlyAttendanceResult = await updateMonthlyAttendance(employeeId, attendanceDate);

		if (!monthlyAttendanceResult) {
			throw new Error('Failed to update monthly attendance');
		}
	}

	const attendanceRequestResult = await prisma.attendanceRequest.update({
		where: { id },
		data: {
			status: status,
		},
	});

	if (!attendanceRequestResult) {
		throw new Error('Failed to update attendance request');
	}

	return attendanceRequestResult;
};










// exports.updateAttendanceRequest = async (id, updateData) => {
// 	const {
// 		employeeId,
// 		attendanceDate,
// 		punchInTime,
// 		punchOutTime,
// 		status,
// 	} = updateData;

// 	console.log(attendanceDate, punchInTime, punchOutTime);

// 	const attendanceRequest = await prisma.attendanceRequest.findUnique({
// 		where: { id },
// 	});

// 	if (!attendanceRequest) {
// 		throw new Error('Attendance request not found');
// 	}

// 	if (updateData.punchInTime && updateData.punchOutTime) {
// 		throw new Error('Both punchInTime and punchOutTime are not allowed. Give only one of them');
// 	}

// 	if (status === 'Approved') {
// 		let attendanceResult;

// 		if (punchInTime) {
// 			attendanceResult = await prisma.attendance.update({
// 				where: {
// 					employeeId_date: {
// 						employeeId: employeeId,
// 						date: new Date(attendanceDate).toISOString(),
// 					},
// 				},
// 				data: {
// 					punchInTime: punchInTime ? punchInTime : null,
// 				}
// 			});
// 		} else if (punchOutTime) {

// 			const start = new Date(attendanceDate);
// 			start.setUTCHours(0, 0, 0, 0);
			
// 			const end = new Date(attendanceDate);
// 			end.setUTCHours(23, 59, 59, 999);
			
// 			console.log(employeeId)
// 			attendanceResult = await prisma.attendance.update({
// 				where: {
// 					employeeId_date: {
// 						employeeId: employeeId,
// 						date: new Date(attendanceDate).toISOString(),
// 					},
// 				},
// 				data: {
// 					punchOutTime: punchOutTime ? punchOutTime : null,
// 				}
// 			});

// 			console.log("I am here 3");
// 		}

// 		if (!attendanceResult) {
// 			throw new Error('Failed to update attendance record');
// 		}

// 		const monthlyAttendanceResult = await updateMonthlyAttendance(employeeId, attendanceDate);

// 		if (!monthlyAttendanceResult) {
// 			throw new Error('Failed to update monthly attendance');
// 		}
// 	}

// 	const attendanceRequestResult = await prisma.attendanceRequest.update({
// 		where: { id },
// 		data: {
// 			status: status,
// 		},
// 	});

// 	if (!attendanceRequestResult) {
// 		throw new Error('Failed to update attendance request');
// 	}

// 	return attendanceRequestResult;
// }

exports.deleteAttendanceRequest = async (employeeId, id) => {
	const attendanceRequest = await prisma.attendanceRequest.findUnique({
		where: { id },
	});

	if (!attendanceRequest) {
		throw new Error('Attendance request not found');
	}

	if (attendanceRequest.employeeId !== employeeId) {
		throw new Error('You do not have permission to delete this request');
	}

	return await prisma.attendanceRequest.delete({
		where: { id },
	});
}