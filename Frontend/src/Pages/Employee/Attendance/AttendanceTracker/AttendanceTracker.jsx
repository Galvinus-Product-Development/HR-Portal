import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './AttendanceTracker.css';

export default function AttendanceTracker() {
	const [selectedMonth, setSelectedMonth] = useState(new Date());
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchAttendanceData();
	}, [selectedMonth]);

	const fetchAttendanceData = async () => {
		setLoading(true);
		setError(null);
		
		const monthYear = selectedMonth.toISOString().slice(0, 7); // Format: YYYY-MM
		const employeeId = localStorage.getItem("signedUserId");  // Get employeeId from local storage
		try {
			// Modified URL to fetch attendance records only for the specific employee
			const response = await fetch(`http://localhost:5003/api/attendance/employee/${employeeId}/monthly/${monthYear}`);
			if (!response.ok) {
				throw new Error('Failed to fetch attendance data');
			}
			const data = await response.json();
			setAttendanceRecords(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handlePreviousMonth = () => {
		setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
	};

	const handleNextMonth = () => {
		setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
	};

	// Format minutes to hours and minutes
	const formatWorkingHours = (minutes) => {
		if (!minutes) return '-';
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins.toString().padStart(2, '0')}m`;
	};

	return (
		<div className="attendance-tracker-container">
			<div className="attendance-tracker-header">
				<div className="attendance-tracker-nav">
					<button onClick={handlePreviousMonth} className="attendance-tracker-nav-btn">
						<ChevronLeft className="attendance-tracker-icon" />
					</button>
					<span className="attendance-tracker-month">
						{selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
					</span>
					<button onClick={handleNextMonth} className="attendance-tracker-nav-btn">
						<ChevronRight className="attendance-tracker-icon" />
					</button>
				</div>
			</div>

			<div className="attendance-tracker-table-wrapper">
				{loading ? (
					<p>Loading attendance records...</p>
				) : error ? (
					<p className="error-message">{error}</p>
				) : (
					<table className="attendance-tracker-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Status</th>
								<th>Check In</th>
								<th>Check Out</th>
								<th>Working Hours</th>
								<th>Overtime</th>
							</tr>
						</thead>
						<tbody>
							{attendanceRecords.map((record, index) => (
								<tr key={index}>
									<td>{new Date(record.date).toLocaleDateString()}</td>
									<td>{record.attendanceStatus}</td>
									<td>{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : '-'}</td>
									<td>{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : '-'}</td>
									<td>{formatWorkingHours(record.workingHours)}</td>
									<td>{record.overtime ? formatWorkingHours(record.overtime) : '-'}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
