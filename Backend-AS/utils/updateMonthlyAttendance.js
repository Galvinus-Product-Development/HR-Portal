const axios = require('axios');

const updateMonthlyAttendance = async (employeeId, attendanceDate) => {
	try {
		// Get current date parts
		const dateNow = new Date(attendanceDate);
		const year = dateNow.getFullYear();
		const month = dateNow.getMonth() + 1;
		const day = dateNow.getDate();

		// Fetch current monthly attendance data
		const getMonthlyAttendence = await fetch(
			`http://localhost:3000/api/monthlyAttendance/${employeeId}?year=${year}&month=${month}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			}
		);

		if (!getMonthlyAttendence.ok) {
			throw new Error("Failed to fetch monthly attendance data");
		}

		const monthlyAttendanceData = await getMonthlyAttendence.json();

		// Ensure absentDays is a number (defaulting to 0 if undefined)
		const currentAbsent = Number(monthlyAttendanceData.absentDays) || 0;
		const newAbsent = Math.max(currentAbsent - 1, 0);

		// Update monthly attendance by decrementing absentDays by 1
		monthlyAttendanceResponse = await fetch(
			`http://localhost:3000/api/monthlyAttendance/${employeeId}?year=${year}&month=${month}&day=${day}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					absentDays: newAbsent,
				}),
			}
		);

		if (!monthlyAttendanceResponse.ok) {
			throw new Error("Failed to save monthly attendance");
		}

		return await monthlyAttendanceResponse.json();
	} catch (error) {
		console.error('Error fetching holidays:', error.message);
		return [];
	}
};

module.exports = updateMonthlyAttendance;