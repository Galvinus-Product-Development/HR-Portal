const attendanceService = require('../services/attendanceService');
const fetchHolidays = require('../utils/fetchHolidays');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.markAttendance = async (req, res) => {
	try {
		const { employeeId, date } = req.body;
		// Step 1: Get all holidays from leave management
		const holidays = await fetchHolidays();

		// Step 2: Format date to compare
		const requestDate = new Date(date).toISOString().split("T")[0];

		// Step 3: Get employee details (assuming you have a method)
		const employee = await prisma.employee.findUnique({
			where: { id: employeeId },
		});

		// Step 4: Check if the given date is a holiday for the employee
		const isHoliday = holidays.some((holiday) => {
			const holidayDate = holiday.date.split("T")[0];
			const isLocationMatch =
				holiday.location === "Global" || holiday.location === employee.location;
			return holidayDate === requestDate && isLocationMatch;
		});

		// Step 5: Return error if it's a holiday
		if (isHoliday) {
			return res.status(400).json({ error: 'Cannot mark attendance on a holiday' });
		}

		const data = await attendanceService.markAttendance(req.body);
		res.status(201).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.manuallyMarkAttendance = async (req, res) => {
	try {
		const { employeeId, date } = req.body;

		// Step 1: Get all holidays from leave management
		const holidays = await fetchHolidays();

		// Step 2: Format date to compare
		const requestDate = new Date(date).toISOString().split("T")[0];

		// Step 3: Get employee details (assuming you have a method)
		const employee = await prisma.employee.findUnique({
			where: { id: employeeId },
		});

		// Step 4: Check if the given date is a holiday for the employee
		const isHoliday = holidays.some((holiday) => {
			const holidayDate = holiday.date.split("T")[0];
			const isLocationMatch =
				holiday.location === "Global" || holiday.location === employee.location;
			return holidayDate === requestDate && isLocationMatch;
		});

		// Step 5: Return error if it's a holiday
		if (isHoliday) {
			return res.status(400).json({ error: 'Cannot mark attendance on a holiday' });
		}

		const today = new Date().getDay();

		// Check if today is Saturday or Sunday
		if (today === 0 || today === 6) {
			return res.status(400).json({ error: 'Cannot mark attendance on weekends' });
		}

		// Step 6: Proceed to mark attendance
		const data = await attendanceService.manuallyMarkAttendance(req.body);
		res.status(201).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.getUncheckedOutEmployees = async (req, res) => {
	const { date } = req.query;
	console.log("Date", date);
  
	if (!date) {
	  return res
		.status(400)
		.json({ message: "Date query parameter is required" });
	}
  
	try {
	  const uncheckedOut = await attendanceService.findUncheckedOutByDate(date);
	  res.status(200).json(uncheckedOut);
	} catch (error) {
	  console.error("Error fetching unchecked-out employees:", error);
	  res.status(500).json({ message: "Server error" });
	}
  };

exports.getAllAttendance = async (req, res) => {
	try {
		let data = await attendanceService.getAllAttendance();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.getAttendanceById = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { year, month } = req.query;
		// const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // Convert UTC to IST

		// Define first and last date of the month in UTC
		const firstDateUTC = new Date(Date.UTC(year, month - 1, 1));
		const lastDateUTC = new Date(Date.UTC(year, month, 0)); // Last day of the month

		// Convert to IST
		// const firstDateIST = new Date(firstDateUTC.getTime() + ISTOffsetMs);
		// const lastDateIST = new Date(lastDateUTC.getTime() + ISTOffsetMs);

		const attendanceData = await attendanceService.getAttendanceById(employeeId, firstDateUTC, lastDateUTC);

		const formattedAttendance = attendanceData.map(record => ({
			...record,
			workingHours: record.workingHours ? `${Math.floor(record.workingHours / 60)}h ${record.workingHours % 60}m` : '-',
			overtime: record.overtime ? `${Math.floor(record.overtime / 60)}h ${record.overtime % 60}m` : '-'
		}));
		res.status(200).json(formattedAttendance);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getTodayAttendance = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const data = await attendanceService.getTodayAttendance(employeeId);
		let workingHours, lateComing, overtime;
		if (data && data.workingHours && data.overtime && data.lateComing) {
			workingHours = `${Math.floor(data.workingHours / 60)}h ${data.workingHours % 60}m`;
			lateComing = `${Math.floor(data.lateComing / 60)}h ${data.lateComing % 60}m`;
			overtime = `${Math.floor(data.overtime / 60)}h ${data.overtime % 60}m`;
		}
		res.status(200).json({ ...data, workingHours, lateComing, overtime, });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateAttendance = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const todayAttendance = await attendanceService.getTodayAttendance(employeeId);
		
		if (!todayAttendance) {
			return res.status(404).json({ error: "No attendance record found for today" });
		}
		
		const data = await attendanceService.updateAttendance(todayAttendance.id, req.body);
		let workingHours, overtime, lateComing;
		if (data.punchInTime && data.punchOutTime) {
			workingHours = `${Math.floor(data.workingHours / 60)}h ${data.workingHours % 60}m`;
			lateComing = `${Math.floor(data.lateComing / 60)}h ${data.lateComing % 60}m`;
			overtime = `${Math.floor(data.overtime / 60)}h ${data.overtime % 60}m`;
		}
		res.status(200).json({ ...data, workingHours, lateComing, overtime, });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteAttendance = async (req, res) => {
	try {
		// const { id } = req.params;
		const data = await attendanceService.deleteAttendance();
		res.status(200).json({ success: "Attendance record deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Get count of employees present today
exports.todayAttendanceCount = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day

        const count = await prisma.attendance.count({
            where: {
                date: { gte: today }, // Attendance recorded today
                attendanceStatus: 'Present' // Only employees marked as Present
            }
        });

        return res.status(200).json({ count });

    } catch (error) {
        console.error("Error fetching present employee count:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



// Overtime Controller						// ------------------ CHANGED HERE --------------------

exports.requestOvertime = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const data = await attendanceService.addOvertime(employeeId, req.body);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.overtimeCheckout = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const data = await attendanceService.overtimeCheckout(employeeId, req.body);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.isOvertimeApproved = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const data = await attendanceService.isOvertimeApproved(employeeId, req.body);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.getOvertimeById = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { year, month } = req.query;
		const data = await attendanceService.getOvertimeById(employeeId, year, month);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.getAllOvertime = async (req, res) => {
	try {
		const data = await attendanceService.getAllOvertime();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}