import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./Holiday.css";
const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
const Holiday = () => {
	const [holidays, setHolidays] = useState([]);
	const [employee, setEmployee] = useState();
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState("All");
	const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
	const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const employeeId = localStorage.getItem("id");

	// Generate years for dropdown (current year ± 5 years)
	const years = Array.from(
		{ length: 11 },
		(_, i) => new Date().getFullYear() - 5 + i
	);

	// Months for dropdown
	const months = [
		"All",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// Fetch holidays and Employee data from API
	useEffect(() => {
		const fetchHolidays = async () => {
			try {
				setLoading(true);
				const response = await fetch(`${API_BASE_URL_LM}/api/holiday`);
				
				if (!response.ok) {
					throw new Error('Failed to fetch holidays');
				}
				
				const data = await response.json();
				console.log(data);
				setHolidays(data);
				setError(null);
			} catch (err) {
				console.error('Error fetching holidays:', err);
				setError('Failed to load holidays. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		const fetchEmployee = async () => {
			try {
				const response = await fetch(`${API_BASE_URL_LM}/api/employees/${employeeId}`);

				if (!response.ok) {
					throw new Error('Failed to fetch employee');
				}

				const data = await response.json();
				console.log(data);
				setEmployee(data);
				setError(null);
			} catch (error) {
				console.error("Error fetching employee details:", error);
				setError("Failed to load employee details");
			}
		};
		
		fetchHolidays();
		fetchEmployee();
	}, []);

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		return `${String(date.getDate()).padStart(2, "0")}-${String(
			date.getMonth() + 1
		).padStart(2, "0")}-${date.getFullYear()}`;
	};

	const toggleDropdown = (dropdown) => {
		if (dropdown === "year") {
			setIsYearDropdownOpen(!isYearDropdownOpen);
			setIsMonthDropdownOpen(false);
		} else if (dropdown === "month") {
			setIsMonthDropdownOpen(!isMonthDropdownOpen);
			setIsYearDropdownOpen(false);
		}
	};

	// Filter holidays based on selected year, month, and employee location
	const filteredHolidays = holidays.filter(holiday => {
		const holidayDate = new Date(holiday.date);
		const holidayYear = holidayDate.getFullYear();
		const holidayMonth = holidayDate.getMonth() + 1;
	
		const matchesYear = holidayYear === selectedYear;
		const matchesMonth =
		selectedMonth === "All" ||
		holidayMonth === months.indexOf(selectedMonth);
	
		// NEW: Location filtering condition
		// Ensure that if employee data exists, the holiday location must be either the same as the employee's or "Global".
		const locationMatches =
			employee
				? holiday.location === employee.location || holiday.location === "Global"
				: true; // If employee isn't loaded yet, allow all
	
		return matchesYear && matchesMonth && locationMatches;
	});

	return (
		<div className="holiday-calendar">
			<h1>Holiday Calendar</h1>

			<div className="filter-controls">
				<div className="dropdown">
					<button
						className="dropdown-toggle"
						onClick={() => toggleDropdown("year")}
					>
						Year: {selectedYear} <ChevronDown size={16} />
					</button>
					{isYearDropdownOpen && (
						<div className="dropdown-menu">
							{years.map((year) => (
								<div
									key={year}
									className={`dropdown-item ${
										selectedYear === year ? "active" : ""
									}`}
									onClick={() => {
										setSelectedYear(year);
										setIsYearDropdownOpen(false);
									}}
								>
									{year}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="dropdown">
					<button
						className="dropdown-toggle"
						onClick={() => toggleDropdown("month")}
					>
						Month: {selectedMonth} <ChevronDown size={16} />
					</button>
					{isMonthDropdownOpen && (
						<div className="dropdown-menu">
							{months.map((month) => (
								<div
									key={month}
									className={`dropdown-item ${
										selectedMonth === month ? "active" : ""
									}`}
									onClick={() => {
										setSelectedMonth(month);
										setIsMonthDropdownOpen(false);
									}}
								>
									{month}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="holiday-table-container">
				<table className="holiday-table">
					<thead>
						<tr>
							<th className="date-column">Date</th>
							<th className="name-column">Name</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan="2" className="loading">
									Loading holidays...
								</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan="2" className="error">
									{error}
								</td>
							</tr>
						) : filteredHolidays.length === 0 ? (
							<tr>
								<td colSpan="2" className="no-data">
									No holidays found
								</td>
							</tr>
						) : (
							filteredHolidays.map((holiday) => (
								<tr key={holiday.id}>
									<td>{formatDate(holiday.date)}</td>
									<td>{holiday.title}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Holiday;