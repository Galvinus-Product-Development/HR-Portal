const attendanceService = require('../services/attendanceService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.markAttendance = async (req, res) => {
	try {
		const data = await attendanceService.markAttendance(req.body);
		res.status(201).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
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
		const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // Convert UTC to IST

		// Define first and last date of the month in UTC
		const firstDateUTC = new Date(Date.UTC(year, month - 1, 1));
		const lastDateUTC = new Date(Date.UTC(year, month, 0)); // Last day of the month

		// Convert to IST
		const firstDateIST = new Date(firstDateUTC.getTime() + ISTOffsetMs);
		const lastDateIST = new Date(lastDateUTC.getTime() + ISTOffsetMs);

		const attendanceData = await attendanceService.getAttendanceById(employeeId, firstDateIST, lastDateIST);

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
