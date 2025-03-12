import React, { useState, useEffect } from "react";
import "./AttendanceDashboard.css";

const AttendanceDashboard = () => {
	// Extend filters to include month and displayMode.
	const [filters, setFilters] = useState({
		location: "",
		department: "",
		name: "",
		month: new Date().getMonth() + 1, // default to current month (1-12)
		displayMode: "monthly", // options: "monthly" or "weekly"
	});

	const [employees, setEmployees] = useState([]);
	const [leaveHistory, setLeaveHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingLeaveHistory, setLoadingLeaveHistory] = useState(true);
	const [error, setError] = useState(null);
	const [errorLeaveHistory, setErrorLeaveHistory] = useState(null);
	const [currentDate] = useState(new Date());

	useEffect(() => {
		fetchEmployees();
	}, []);

	// Fetch leave history whenever the month filter changes.
	useEffect(() => {
		fetchLeaveHistory();
	}, [filters.month]);

	const fetchEmployees = async () => {
		try {
			// Note: backend port for employees remains 5003.
			const response = await fetch("http://localhost:5003/api/employees");
			if (!response.ok) {
				throw new Error("Failed to fetch employee data");
			}
			const data = await response.json();
			console.log("Fetched employees:", data); // Debug log
			if(!data.message)setEmployees(data);
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	const fetchLeaveHistory = async () => {
		try {
			const currentYear = new Date().getFullYear();
			const response = await fetch(`http://localhost:5005/api/leave-history?year=${currentYear}&month=${filters.month}`);
			if (!response.ok) {
				throw new Error("Failed to fetch leave history data");
			}
			const data = await response.json();
			console.log("Fetched leave history:", data); // Debug log
			setLeaveHistory(data);
			setLoadingLeaveHistory(false);
		} catch (error) {
			setErrorLeaveHistory(error.message);
			setLoadingLeaveHistory(false);
		}
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters({ ...filters, [name]: value });
	};

	// Helper function to format minutes to "0h 00m" format.
	const formatTimeToHoursMinutes = (totalMinutes) => {
		if (totalMinutes === 0 || !totalMinutes) return "0h 00m";
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
	};

	// Compute monthly leave counts for a given employee.
	const getMonthlyLeaveCounts = (employeeId) => {
		// Log the employee ID and leave history for debugging
		console.log(`Getting monthly leave counts for employee ${employeeId}`);
		
		// Check both formats of employee ID to ensure we match correctly
		const employeeLeaves = leaveHistory.filter(
			(record) => {
				// Check for potential different formats of employee ID
				const employeeMatches = 
					(record.employee && record.employee.employeeId === String(employeeId)) ||
					(record.employee && record.employee.id === employeeId) ||
					(record.employeeId === String(employeeId)) ||
					(record.employeeId === employeeId);
				
				return employeeMatches;
			}
		);
		
		console.log(`Found ${employeeLeaves.length} leave records for employee ${employeeId}`, employeeLeaves);
		
		// Use the paidLeave and unpaidLeave values directly from the database
		const paid = employeeLeaves.reduce((sum, record) => sum + (record.paidLeave || 0), 0);
		const unpaid = employeeLeaves.reduce((sum, record) => sum + (record.unpaidLeave || 0), 0);
		
		console.log(`Calculated leaves for employee ${employeeId}: paid=${paid}, unpaid=${unpaid}`);
		
		// Only reset if we're viewing the current month AND it's the first day of that month
		const shouldReset = 
			filters.month === (currentDate.getMonth() + 1) && 
			currentDate.getDate() === 1; // First day of month
			
		console.log(`Should reset? ${shouldReset}`);
		
		return { 
			paid: shouldReset ? 0 : paid, 
			unpaid: shouldReset ? 0 : unpaid 
		};
	};

	// Compute weekly leave counts for a given employee.
	const getWeeklyLeaveCounts = (employeeId) => {
		// Check both formats of employee ID to ensure we match correctly
		const employeeLeaves = leaveHistory.filter(
			(record) => {
				// Check for potential different formats of employee ID
				const employeeMatches = 
					(record.employee && record.employee.employeeId === String(employeeId)) ||
					(record.employee && record.employee.id === employeeId) ||
					(record.employeeId === String(employeeId)) ||
					(record.employeeId === employeeId);
				
				return employeeMatches;
			}
		);
		
		// Initialize weeks 1 to 5.
		const weeks = {
			1: { paid: 0, unpaid: 0 },
			2: { paid: 0, unpaid: 0 },
			3: { paid: 0, unpaid: 0 },
			4: { paid: 0, unpaid: 0 },
			5: { paid: 0, unpaid: 0 },
		};
		
		// Only reset if we're viewing the current month AND it's the first day of that month
		const shouldReset = 
			filters.month === (currentDate.getMonth() + 1) && 
			currentDate.getDate() === 1; // First day of month
			
		if (!shouldReset) {
			employeeLeaves.forEach((record) => {
				const appliedOn = new Date(record.appliedOn);
				const day = appliedOn.getDate();
				let weekNumber;
				if (day <= 7) weekNumber = 1;
				else if (day <= 14) weekNumber = 2;
				else if (day <= 21) weekNumber = 3;
				else if (day <= 28) weekNumber = 4;
				else weekNumber = 5;

				weeks[weekNumber].paid += record.paidLeave || 0;
				weeks[weekNumber].unpaid += record.unpaidLeave || 0;
			});
		}
		
		return weeks;
	};
	
	// Calculate the number of weekend days (Saturdays and Sundays) in the given month
	const getWeekendDaysInMonth = () => {
		const year = new Date().getFullYear();
		const month = filters.month - 1; // JavaScript months are 0-indexed
		
		// Get the number of days in the month
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		
		let weekendCount = 0;
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);
			const dayOfWeek = date.getDay();
			
			// 0 is Sunday, 6 is Saturday
			if (dayOfWeek === 0 || dayOfWeek === 6) {
				weekendCount++;
			}
		}
		
		return weekendCount;
	};

	// Filter employees using the filters for location, department, and name.
	const filteredEmployees = employees.filter((emp) => {
		return (
			(!filters.location || emp.location === filters.location) &&
			(!filters.department || emp.department === filters.department) &&
			(!filters.name ||
				emp.name.toLowerCase().includes(filters.name.toLowerCase()))
		);
	});

	// Handle overall loading and error states.
	if (loading || loadingLeaveHistory) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (errorLeaveHistory) return <p>Error: {errorLeaveHistory}</p>;
	
	// Calculate week offs once for all employees
	const weekOffs = getWeekendDaysInMonth();

	return (
		<div className="attendance-dashboard-container">
			<div className="attendance-dashboard-header">
				<div className="header-part">
					<h2>Attendance Dashboard</h2>
					<p className="attendance-dashboard-subtitle">
						Monitor and track daily attendance and leave history insights effortlessly.
					</p>
				</div>
				<button>Download Report</button>
			</div>

			{/* Filters section displayed in a single line */}
			<div className="attendance-dashboard-filters" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
				<div className="filter-group">
					<label>Location</label>
					<select name="location" onChange={handleFilterChange} value={filters.location}>
						<option value="">All Locations</option>
						{[...new Set(employees.map((emp) => emp.location))].map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</select>
				</div>
				<div className="filter-group">
					<label>Department</label>
					<select name="department" onChange={handleFilterChange} value={filters.department}>
						<option value="">All Departments</option>
						{[...new Set(employees.map((emp) => emp.department))].map((department) => (
							<option key={department} value={department}>
								{department}
							</option>
						))}
					</select>
				</div>
				<div className="filter-group">
					<label>Employee Name</label>
					<input
						type="text"
						name="name"
						value={filters.name}
						onChange={handleFilterChange}
						placeholder="Search by Name"
					/>
				</div>
				<div className="filter-group">
					<label>Month</label>
					<select name="month" onChange={handleFilterChange} value={filters.month}>
						<option value={1}>January</option>
						<option value={2}>February</option>
						<option value={3}>March</option>
						<option value={4}>April</option>
						<option value={5}>May</option>
						<option value={6}>June</option>
						<option value={7}>July</option>
						<option value={8}>August</option>
						<option value={9}>September</option>
						<option value={10}>October</option>
						<option value={11}>November</option>
						<option value={12}>December</option>
					</select>
				</div>
				<div className="filter-group">
					<label>Display Mode</label>
					<select name="displayMode" onChange={handleFilterChange} value={filters.displayMode}>
						<option value="monthly">Monthly</option>
						<option value="weekly">Weekly</option>
					</select>
				</div>
			</div>

			<div className="table-responsive-container">
				<table className="attendance-dashboard-table">
					<thead>
						<tr>
							<th>Employee Name</th>
							<th>Employee ID</th>
							<th>Job Title</th>
							<th>Phone Number</th>
							<th>Location</th>
							<th>Department</th>
							<th>Present</th>
							<th>Absent</th>
							<th>Half Day</th>
							<th>Week Off</th>
							{/* Conditional rendering of leave history columns */}
							{filters.displayMode === "monthly" ? (
								<>
									<th>Paid Leave</th>
									<th>Unpaid Leave</th>
								</>
							) : (
								// For weekly mode, we show two columns per week (Week 1 to Week 5)
								[1, 2, 3, 4, 5].map((week) => (
									<React.Fragment key={week}>
										<th>Paid Leave W{week}</th>
										<th>Unpaid Leave W{week}</th>
									</React.Fragment>
								))
							)}
							<th>Overtime</th>
							<th>Working Hours</th>
							<th>Late Coming</th>
							<th>Early Leaving</th>
						</tr>
					</thead>
					<tbody>
						{filteredEmployees.map((employee) => {
							// Calculate leave counts based on display mode.
							let leaveCells;
							let paidLeaves = 0;
							let unpaidLeaves = 0;
							
							if (filters.displayMode === "monthly") {
								const { paid, unpaid } = getMonthlyLeaveCounts(employee.id);
								paidLeaves = paid;
								unpaidLeaves = unpaid;
								leaveCells = (
									<>
										<td>{paid}</td>
										<td>{unpaid}</td>
									</>
								);
							} else {
								const weeklyCounts = getWeeklyLeaveCounts(employee.id);
								// Sum up all weekly paid and unpaid leaves for the absent calculation
								paidLeaves = Object.values(weeklyCounts).reduce((sum, week) => sum + week.paid, 0);
								unpaidLeaves = Object.values(weeklyCounts).reduce((sum, week) => sum + week.unpaid, 0);
								
								leaveCells = [1, 2, 3, 4, 5].map((week) => (
									<React.Fragment key={week}>
										<td>{weeklyCounts[week].paid}</td>
										<td>{weeklyCounts[week].unpaid}</td>
									</React.Fragment>
								));
							}
							
							// Calculate total absences as sum of paid and unpaid leaves
							const totalAbsences = paidLeaves + unpaidLeaves;

							return (
								<tr key={employee.id}>
									<td>{employee.name}</td>
									<td>{employee.id}</td>
									<td>{employee.designation}</td>
									<td>{employee.phone}</td>
									<td>{employee.location}</td>
									<td>{employee.department}</td>
									<td>
										{employee.attendance.reduce(
											(sum, record) => sum + (record.attendanceStatus === "Present" ? 1 : 0),
											0
										)}
									</td>
									<td>{totalAbsences}</td>
									<td>0</td>
									<td>{weekOffs}</td>
									{/* Render leave history cells */}
									{leaveCells}
									<td>
										{employee.attendance.reduce(
											(sum, record) => sum + (record.overtime || 0),
											0
										)}
									</td>
									<td>
										{formatTimeToHoursMinutes(
											employee.attendance.reduce(
												(sum, record) => sum + (record.workingHours || 0),
												0
											)
										)}
									</td>
									<td>
										{formatTimeToHoursMinutes(
											employee.attendance.reduce(
												(sum, record) => sum + (record.lateComing || 0),
												0
											)
										)}
									</td>
									<td>
										{formatTimeToHoursMinutes(
											employee.attendance.reduce(
												(sum, record) => sum + (record.earlyLeaving || 0),
												0
											)
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AttendanceDashboard;