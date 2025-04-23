const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const calculateWorkingDays = require("../utils/calculateWorkingDays");
const monthlyAttendanceService = require("../services/monthlyAttendanceService");

exports.getAllMonthlyAttendance = async (req, res) => {
	try {
		const data = await monthlyAttendanceService.getAllMonthlyAttendance();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.getMonthlyAttendanceById = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { year, month } = req.query;
		const data = await monthlyAttendanceService.getMonthlyAttendanceById(employeeId, year, month);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// exports.addMonthlyAttendance = async (req, res) => {
// 	try {
// 		const { employeeId } = req.params;
// 		const { year, month } = req.query;

// 		// Define first and last date of the month
// 		const firstDate = new Date(year, month - 1, 1);
// 		const lastDate = new Date(year, month, 0); // Last day of the month

// 		const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // Convert UTC to IST

// 		// Fetch attendance records for the month
// 		const monthlyAttendanceData = await prisma.attendance.findMany({
// 			where: {
// 				employeeId: employeeId,
// 				date: {
// 					gte: firstDate,
// 					lte: lastDate, // Ensure last day is included
// 				},
// 			},
// 		});

// 		// Calculate total working days for the month
// 		const totalWorkingDays = calculateWorkingDays({ year, month });

// 		// Count total present days
// 		const totalPresentDays = monthlyAttendanceData.filter(record => record.attendanceStatus === 'Present').length;

// 		// Late Calculation Logic
// 		let totalLateDays = 0;
// 		let totalMonthlyLateComing = 0;

// 		monthlyAttendanceData.forEach(record => {
// 			const punchInDate = new Date(record.punchInTime);
// 			const punchInTime = punchInDate.getTime() + ISTOffsetMs;

// 			// Define daily late threshold (10:30 AM in IST)
// 			const dailyLateThreshold = new Date(punchInDate.getFullYear(), punchInDate.getMonth(), punchInDate.getDate(), 10, 30, 0).getTime();

// 			if (punchInTime > dailyLateThreshold) {
// 				totalLateDays++;
// 				totalMonthlyLateComing += record.lateComing || 0; // Handle null values
// 			}
// 		});

// 		// Calculate total overtime hours
// 		const totalOvertimeHours = monthlyAttendanceData.reduce((sum, record) => sum + (record.overtime || 0), 0);

// 		// Update or create the monthly attendance stats
// 		const updateMonthlyData = await prisma.monthlyAttendanceStats.upsert({
// 			where: {
// 				employeeId_monthYear: {
// 					employeeId: employeeId,
// 					monthYear: `${year}-${month}`,
// 				}
// 			},
// 			update: {
// 				presentDays: totalPresentDays,
// 				lateDays: totalLateDays,
// 				monthlyLateComing: totalMonthlyLateComing, // Ensure it's updated
// 				overtimeHours: totalOvertimeHours,
// 			},
// 			create: {
// 				employeeId: employeeId,
// 				monthYear: `${year}-${month}`,
// 				workingDays: totalWorkingDays,
// 				presentDays: totalPresentDays,
// 				lateDays: totalLateDays,
// 				monthlyLateComing: totalMonthlyLateComing,
// 				overtimeHours: totalOvertimeHours,
// 			}
// 		});

// 		res.status(200).send(updateMonthlyData);
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };

exports.addMonthlyAttendance = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { year, month } = req.query;
		console.log("I am here")

		// Define first and last date of the month
		const firstDate = new Date(year, month - 1, 1);
		const lastDate = new Date(year, month, 0); // Last day of the month

		// Fetch attendance records for the month
		const monthlyAttendanceData = await prisma.attendance.findMany({
			where: {
				employeeId: employeeId,
				date: {
					gte: firstDate,
					lte: lastDate, // Ensure last day is included
				},
			},
		});

		// Calculate total working days for the month
		const totalWorkingDays = calculateWorkingDays({ year, month });

		// Count total present and absent days based on attendance records
		const totalPresentDays = monthlyAttendanceData.filter(
			(record) => record.attendanceStatus === 'Present'
		).length;
		const totalAbsentDays = monthlyAttendanceData.filter(
			(record) => record.attendanceStatus === 'Absent'
		).length;
		let totalLateDays = monthlyAttendanceData.reduce(
			(sum, record) => sum + (record.lateDays || 0),     //CHANGED HERE -----------------
			0
		);
		let totalMonthlyLateComing = monthlyAttendanceData.reduce((sum, record) => {		// -------------- CHANGED HERE -----------------
			return sum + (record.lateComing || 0);
		}, 0);
		const totalOvertimeHours = monthlyAttendanceData.reduce(	// -------------- CHANGED HERE -----------------
			(sum, record) => sum + (record.overtime || 0),
			0
		);
		let totalEarlyLeaving = monthlyAttendanceData.reduce((sum, record) => {		// -------------- CHANGED HERE -----------------
			return sum + (record.earlyLeaving || 0);
		}, 0);

		// Use the absentDays provided in the request body if available;
		// otherwise, fall back to the computed totalAbsentDays.
		const updatedAbsentDays =
			req.body && req.body.absentDays !== undefined
				? Number(req.body.absentDays)
				: totalAbsentDays;

		// Update or create the monthly attendance stats using upsert
		const updateMonthlyData = await prisma.monthlyAttendanceStats.upsert({
			where: {
				employeeId_monthYear: {
					employeeId: employeeId,
					monthYear: `${year}-${month}`,
				},
			},
			update: {
				presentDays: totalPresentDays,
				absentDays: updatedAbsentDays, // Use adjusted absentDays if provided
				lateDays: totalLateDays,
				monthlyLateComing: totalMonthlyLateComing,
				overtimeHours: totalOvertimeHours,
				earlyLeaving: totalEarlyLeaving,	// -------------- CHANGED HERE -----------------
			},
			create: {
				employeeId: employeeId,
				monthYear: `${year}-${month}`,
				workingDays: totalWorkingDays? totalWorkingDays : 0,
				presentDays: totalPresentDays? totalPresentDays : 0,
				absentDays: totalAbsentDays? totalAbsentDays : 0,
				lateDays: totalLateDays? totalLateDays : 0,
				monthlyLateComing: totalMonthlyLateComing? totalMonthlyLateComing : 0,
				overtimeHours: totalOvertimeHours? totalOvertimeHours : 0,
				earlyLeaving: totalEarlyLeaving? totalEarlyLeaving : 0,	// -------------- CHANGED HERE -----------------
			},
		});

		res.status(200).send(updateMonthlyData);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


exports.updateMonthlyAttendance = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { year, month } = req.query;
		const { absentDays } = req.body;

		// Define first and last date of the month
		const firstDate = new Date(year, month - 1, 1);
		const lastDate = new Date(year, month, 0); // Last day of the month

		// const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // Convert UTC to IST

		// Fetch attendance records for the month
		const monthlyAttendanceData = await prisma.attendance.findMany({
			where: {
				employeeId: employeeId,
				date: {
					gte: firstDate,
					lte: lastDate, // Ensure last day is included
				},
			},
		});

		let totalHalfDays = 0;
		let totalOvertimeHours = 0;
		let totalEarlyLeaving = 0;

		monthlyAttendanceData.forEach(record => {
			if (record.punchOutTime) {
				// Convert punchOutTime from UTC to IST
				const punchOutIST = new Date(record.punchOutTime);							// ---------------- CHANGED HERE ----------------------
				// const punchOutIST = new Date(punchOutUTC.getTime() + ISTOffsetMs);

				// Define Half-Day Threshold (3:30 PM IST)
				const halfDayThreshold = new Date(punchOutIST);
				halfDayThreshold.setHours(15, 30, 0, 0); // Set to 3:30 PM IST

				// Check if punchOutTime is before 3:30 PM IST
				if (punchOutIST < halfDayThreshold) {
					totalHalfDays++;
				}
			}

			// Sum up overtime hours and early leaving
			totalOvertimeHours += record.overtime || 0;
			totalEarlyLeaving += record.earlyLeaving || 0;	// ---------------- CHANGED HERE ------------------
		});

		const sendData = {
			halfDays: totalHalfDays,
    		overtimeHours: totalOvertimeHours,
			absentDays,
			totalEarlyLeaving,	// ---------------- CHANGED HERE ------------------
		}

		// Update monthly attendance with calculated values
		const data = await monthlyAttendanceService.updateMonthlyAttendance(employeeId, sendData, year, month);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateMonthlyAbsentDays = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { year, month } = req.query;
		const { absentDays } = req.body;
		const data = await monthlyAttendanceService.updateMonthlyAbsentDays(employeeId, absentDays, year, month);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteMonthlyAttendance = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await monthlyAttendanceService.deleteMonthlyAttendance(id);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}