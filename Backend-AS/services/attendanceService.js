const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.markAttendance = async (attendanceData) => {
	const { 
		employeeId,
		date,
		punchInTime,
		attendanceStatus,
		punchInMethod,
	} = attendanceData;

	const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
	let lateComing = 0;

	// Convert date from UTC to IST before checking and storing
	const utcDate = new Date(date);
	const dateIST = new Date(utcDate.getTime() + ISTOffsetMs);
	dateIST.setHours(0, 0, 0, 0); // Normalize to the start of the day
	console.log(utcDate);

	startDate = new Date(dateIST);
	startDate.setHours(0, 0, 0, 0); // Start of the day
	endDate = new Date(dateIST);
	endDate.setHours(23, 59, 59, 999); // End of the day

	// Check if the employee has already checked in today
	const existingAttendance = await prisma.attendance.findFirst({
		where: {
			employeeId: employeeId,
			date: {
				gte: startDate,
				lte: endDate,
			}
		},
	});

	if (existingAttendance) {
		throw new Error("Attendance already marked for today. Multiple check-ins are not allowed.");
	}

	// Calculate late coming (if applicable)
	if (punchInTime) {
		const punchInUTC = new Date(punchInTime);
		const punchInIST = new Date(punchInUTC.getTime() + ISTOffsetMs); // Converted to IST

		// Set the late threshold time (10:30 AM IST)
		const lateThreshold = new Date(punchInIST);
		lateThreshold.setHours(10, 30, 0, 0); // 10:30 AM IST

		if (punchInIST > lateThreshold) {
			lateComing = Math.floor((punchInIST - lateThreshold - ISTOffsetMs) / (1000 * 60)); // Calculate late time in minutes
		}
	}

	// Store attendance
	const attendance = await prisma.attendance.create({
		data: {
			employeeId,
			date: punchInTime ? new Date(new Date(punchInTime).getTime() + ISTOffsetMs) : null, // Store IST time
			punchInTime: punchInTime ? new Date(new Date(punchInTime).getTime() + ISTOffsetMs) : null, // Store IST time
			attendanceStatus,
			punchInMethod,
			lateComing, // Late coming in minutes (calculated in IST)
		}
	});

	return attendance;
};

exports.updateAttendance = async (id, updateData) => {
	let workingHours = 0;
	let overtime = 0;
	const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds

	// Handle punch out updates
	if (updateData.punchOutTime && updateData.punchOutMethod) {
		const attendance = await prisma.attendance.findUnique({	where: { id } });

		if (attendance && attendance.punchInTime) {
			// Convert punchInTime (already stored as IST in your database)
			const punchIn = new Date(attendance.punchInTime);

			// Convert the incoming UTC punchOutTime to IST
			const punchOutUTC = new Date(updateData.punchOutTime);
			const punchOutIST = new Date(punchOutUTC.getTime() - ISTOffsetMs);

			// Calculate working hours in minutes using IST times
			workingHours = Math.floor((punchOutIST - punchIn) / (1000 * 60));
			
			/// Check for overtime (workingHours > 570 minutes)
			if (workingHours > 570) {
				overtime = workingHours - 570;
			}

			// Update updateData with the converted punchOutTime
			updateData.punchOutTime = punchOutIST;
		}
	}

	return await prisma.attendance.update({	where: { id }, data: { ...updateData, workingHours, overtime } });
};

exports.getAllAttendance = async () => {
	return await prisma.attendance.findMany();
}

exports.getAttendanceById = async (employeeId, firstDate, lastDate) => {
	// Fetch attendance records for the month
	return await prisma.attendance.findMany({
		where: {
			employeeId: employeeId,
			date: {
				gte: firstDate,
				lte: lastDate, // Ensure last day is included
			},
		},
	});
};

exports.getTodayAttendance = async (employeeId) => {
    const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds

    // Get the current date in UTC
    const todayUTC = new Date();
    todayUTC.setHours(0, 0, 0, 0);

    // Convert the current date to IST
    const todayIST = new Date(todayUTC.getTime() + ISTOffsetMs);

    // Get the start of the next day in IST
    const tomorrowIST = new Date(todayIST);
    tomorrowIST.setDate(tomorrowIST.getDate() + 1);

    return await prisma.attendance.findFirst({
        where: {
            employeeId: employeeId,
            date: {
                gte: todayIST,
                lt: tomorrowIST
            }
        }
    });
};

exports.deleteAttendance = async () => {
	return await prisma.attendance.deleteMany();
}