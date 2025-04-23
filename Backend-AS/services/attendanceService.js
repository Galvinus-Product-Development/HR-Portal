const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const schedule = require('node-schedule');

exports.markAttendance = async (attendanceData) => {
	const { 
		employeeId,
		date,
		punchInTime,
		attendanceStatus,
		punchInMethod,
	} = attendanceData;

	// const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds			// ------------ CHANGED HERE --------------
	let lateComing = 0;
	let lateDays = 0;

	// Convert date from UTC to IST before checking and storing
	// const dateIST = new Date(date);									// --------------- CHANGED HERE -----------------------
	const dateIST = new Date(date);
	dateIST.setHours(0, 0, 0, 0); // Normalize to the start of the day

	startDate = new Date(dateIST);
	startDate.setHours(0, 0, 0, 0); // Start of the day
	endDate = new Date(dateIST);
	endDate.setHours(23, 59, 59, 999); // End of the day

	// Check if the employee has already checked in today							// --------------- CHANGED HERE ---------------------
	const existingAttendance = await prisma.attendance.findFirst({
		where: {
			employeeId: employeeId,
			date: {
				gte: startDate,
				lte: endDate,
			}
		},
	});

	if (existingAttendance && !existingAttendance.attendanceStatus === "Absent") {
		throw new Error("Attendance already marked for today. Multiple check-ins are not allowed.");
	}

	// Calculate late coming (if applicable)
	if (punchInTime) {
		// const punchInTime = new Date(punchInTime);							// -------------------- CHANGED HERE ------------------------
		const punchInIST = new Date(punchInTime); // Converted to IST

		// Set the late threshold time (10:30 AM IST)
		const lateThreshold = new Date(punchInIST);
		lateThreshold.setHours(10, 35, 0, 0); // 10:30 AM IST

		if (punchInIST > lateThreshold) {
			lateComing = Math.floor((punchInIST - lateThreshold) / (1000 * 60)); // Calculate late time in minutes				// -------------------------- CHANGED HERE ---------------------------
			lateDays++;			// ---------------- CHANGED HERE -----------------
		}
	}
	
	// Store attendance
	const attendance = await prisma.attendance.create({
		data: {
			employeeId,
			date: punchInTime ? new Date(punchInTime) : null, // Store IST time					// -------------- CHANGED HERE ---------------------
			punchInTime: punchInTime ? new Date(punchInTime) : null, // Store IST time
			attendanceStatus,
			punchInMethod,
			lateComing, // Late coming in minutes (calculated in IST)
			lateDays			// -------------- CHANGED HERE -----------------
		}
	});

	if (punchOutTime) {
		const job = schedule.scheduledJobs[`punchout-${employeeId}`];
		if (job) {
			job.cancel();
			console.log(`🛑 Cancelled auto punch-out for employee ${employeeId} (manually punched out).`);
		}
	}

	return attendance;
};

exports.manuallyMarkAttendance = async (attendanceData) => {			// ---------------------- CHANGED HERE ------------------------
	const { 
		employeeId,
		date,
		punchInTime,
		punchOutTime,
		attendanceStatus,
		punchInMethod,
		punchOutMethod,
	} = attendanceData;

	let lateComing = 0;
	let lateDays = 0;
	let workingHours = 0;
	let earlyLeaving = 0;
	let overtime = 0;
	console.log(date);

	// Normalize the date to the start of the day
	const normalizedDate = new Date(date);
	normalizedDate.setHours(0, 0, 0, 0);

	startDate = new Date(normalizedDate);
	startDate.setHours(0, 0, 0, 0); // Start of the day
	endDate = new Date(normalizedDate);
	endDate.setHours(23, 59, 59, 999); // End of the day

	// Check if the employee has already checked in today							// --------------- CHANGED HERE ---------------------
	const existingAttendance = await prisma.attendance.findFirst({
		where: {
			employeeId: employeeId,
			date: {
				gte: startDate,
				lte: endDate,
			}
		}, 
	});

	if (existingAttendance && !existingAttendance.attendanceStatus === "Absent") {
		throw new Error("Attendance already marked for today. Multiple check-ins are not allowed.");
	}

	// Calculate late coming (if applicable)
	if (punchInTime) {
		const punchInIST = new Date(punchInTime);
		const lateThreshold = new Date(punchInIST);
		lateThreshold.setHours(10, 35, 0, 0); // 10:35 AM IST

		if (punchInIST > lateThreshold) {
			lateComing = Math.floor((punchInIST - lateThreshold) / (1000 * 60)); // in minutes
			lateDays++;			// ---------------- CHANGED HERE -----------------
		}
	}

	// Calculate working hours and overtime
	if (punchOutTime) {
		const punchIn = new Date(punchInTime);
		const punchOutIST = new Date(punchOutTime);
		workingHours = Math.floor((punchOutIST - punchIn) / (1000 * 60));
		if (workingHours > 570) {
			overtime = workingHours - 570;
		} else {						// -------------------- CHANGED HERE --------------------
			earlyLeaving++;
		}
	}

	// Upsert attendance using normalized date
	const attendance = await prisma.attendance.upsert({
		where: {
			employeeId_date: {
				employeeId,
				date: normalizedDate,
			}
		},
		create: {
			employeeId,
			date: normalizedDate, // Store normalized date		// --------- CHANGED HERE --------------
			punchInTime: punchInTime ? new Date(punchInTime) : null,
			punchOutTime: punchOutTime ? new Date(punchOutTime) : null,
			attendanceStatus,
			punchInMethod,
			punchOutMethod,
			lateDays,
			lateComing,				// -------------------- CHANGED HERE --------------------
			workingHours,
			earlyLeaving,			// -------------------- CHANGED HERE --------------------
			overtime
		},
		update: {
			// Update only if needed
			punchInTime: punchInTime ? new Date(punchInTime) : null,
			punchOutTime: punchOutTime ? new Date(punchOutTime) : null,
			attendanceStatus,
			punchInMethod,
			lateDays,						// ------------- CHANGED HERE -----------------
			lateComing,
			workingHours,
			earlyLeaving,		// -------------------- CHANGED HERE --------------------
			overtime
		}
	});

	return attendance;
};

exports.updateAttendance = async (id, updateData) => {
	let workingHours = 0;
	// let overtime = 0;
	let earlyLeaving = 0;			// -------------------- CHANGED HERE --------------------

	// Handle punch out updates
	if (updateData.punchOutTime && updateData.punchOutMethod) {
		const attendance = await prisma.attendance.findUnique({	where: { id } });

		if (attendance && attendance.punchInTime) {
			// Convert punchInTime (already stored as IST in your database)
			const punchIn = new Date(attendance.punchInTime);

			// Convert the incoming UTC punchOutTime to IST
			const punchOutIST = new Date(updateData.punchOutTime);

			// Calculate working hours in minutes using IST times
			workingHours = Math.floor((punchOutIST - punchIn) / (1000 * 60));
			
			/// Check for overtime (workingHours > 570 minutes)
			if (workingHours < 570) {
				earlyLeaving = workingHours - 570;
			} 
			// else {
			// 	earlyLeaving++;			// -------------------- CHANGED HERE --------------------
			// }

			// Update updateData with the converted punchOutTime
			updateData.punchOutTime = punchOutIST;
		}
	}

	return await prisma.attendance.update({	where: { id }, data: { ...updateData, workingHours, earlyLeaving } });
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
	// const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds				// -------------------------- CHANGED HERE ----------------------------

	// Get the current date in UTC
	const today = new Date();							// ---------------------------- CHANGED HERE ----------------------------
	today.setHours(0, 0, 0, 0);

	// Convert the current date to IST
	// const todayIST = new Date(todayUTC.getTime() + ISTOffsetMs);				// --------------------------- CHANGED HERE ------------------------------

	// Get the start of the next day in IST
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);			// ------------------------- CHANGED HERE --------------------------

	return await prisma.attendance.findFirst({
		where: {
			employeeId: employeeId,
			date: {
				gte: today,
				lt: tomorrow
			}
		}
	});
};

exports.deleteAttendance = async () => {
	return await prisma.attendance.deleteMany();
}

// exports.isOvertimeApproved = async (employeeId, data) => {
// 	const { date, overtimeStatus } = data;

// 	const existingAttendance = await prisma.attendance.findUnique({
// 		where: {
// 			employeeId_date: {
// 				employeeId,
// 				date,
// 			}
// 		}
// 	});

// 	if (!existingAttendance) {
// 		throw new Error("Attendance record not found for the specified date.");
// 	}

// 	return await prisma.attendance.update({
// 		where: {
// 			id: existingAttendance.id,
// 		},
// 		data: {
// 			overtimeStatus,
// 		}
// 	});
// }

// exports.overtimeCheckout=async(employeeId,data)=>{try {
// 	const { overtimePunchOut } = data;

// 	const overtimeWorking=0;
// 	const overtime=0

// 	const existingAttendance = await prisma.attendance.findUnique({
// 		where: {
// 			employeeId_date: {
// 				employeeId,
// 				date,
// 			}
// 		}
// 	});

// 	if (!existingAttendance) {
// 		throw new Error("Attendance record not found for the specified date.");
// 	}

// 	workingHours=overtimePunchOut-existingAttendance.overtimePunchIn
// 	if(workingHours>existingAttendance.overtimeDuration){
// 		overtime=existingAttendance.overtimeDuration
// 	}
// 	else{
// 		overtime=workingHours
// 	}


// return await prisma.attendance.update({
// 		where: {
// 			id: existingAttendance.id,
// 		},
// 		data: {
// 			overtimePunchOut:overtimePunchOut,
// 			overtime:overtime
			
// 		}
// 	});	
// } catch (error) {
	
// }}