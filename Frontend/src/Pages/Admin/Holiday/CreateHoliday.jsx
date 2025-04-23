import React, { useState, useEffect } from "react";
import "./CreateHoliday.css";
import {
	ChevronLeft,
	ChevronRight,
	Calendar,
	X,
	Plus,
	Save,
	Trash2,
} from "lucide-react";
const API_BASE_URL_LM= import.meta.env.VITE_API_BASE_URL_LM;
function CreateHoliday() {
	const [holidays, setHolidays] = useState([]);

	// State for temporary batch of holidays to be added
	const [pendingHolidays, setPendingHolidays] = useState([]);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showCalendar, setShowCalendar] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [currentHoliday, setCurrentHoliday] = useState({
		date: "",
		title: "",
		location: "",
	});
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState("All");
	// const [selectedDepartment, setSelectedDepartment] = useState("All");
	const [selectedLocation, setSelectedLocation] = useState("All");
	const [editingHolidayId, setEditingHolidayId] = useState(null);
	const [editMode, setEditMode] = useState(false);

	// 1. Add new state variables at the top with other state declarations
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingHoliday, setEditingHoliday] = useState(null);
	const [deletingHoliday, setDeletingHoliday] = useState(null);

	// Years for dropdown
	const years = Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i);

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

	// Departments for dropdown
	// const departments = [
	// 	"All",
	// 	"HR",
	// 	"IT",
	// 	"Finance",
	// 	"Marketing",
	// 	"Operations",
	// ];

	// Locations for dropdown
	const locations = ["All", "Global", "Silchar", "Bangalore"];

	const formatDateForDisplay = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return `${String(date.getDate()).padStart(2, "0")}-${String(
			date.getMonth() + 1
		).padStart(2, "0")}-${date.getFullYear()}`;
	};

	const formatDateForInput = (dateString) => {
		const date = new Date(dateString);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			"0"
		)}-${String(date.getDate()).padStart(2, "0")}`;
	};

	const filteredHolidays = holidays.filter((holiday) => {
		const holidayDate = new Date(holiday.date);
		const yearMatches =
			selectedYear === "All" ||
			holidayDate.getFullYear() === selectedYear;
		const monthMatches =
			selectedMonth === "All" ||
			holidayDate.getMonth() === months.indexOf(selectedMonth) - 1;
		const locationMatches =
			selectedLocation === "All" || holiday.location === selectedLocation;
		return yearMatches && monthMatches && locationMatches;
	});

	const handleAddHolidayForm = () => {
		setShowAddForm(true);
		setCurrentHoliday({
			date: formatDateForInput(new Date()),
			title: "",
			location: "Global",
		});
		setEditMode(false);
		setEditingHolidayId(null);
	};

	const handleAddToBatch = () => {
		if (
			!currentHoliday.title ||
			!currentHoliday.date ||
			!currentHoliday.location
		) {
			alert("Please fill in all fields");
			return;
		}

		if (editMode) {
			// Update existing pending holiday
			setPendingHolidays(
				pendingHolidays.map((h) =>
					h.tempId === editingHolidayId
						? { ...currentHoliday, tempId: h.tempId }
						: h
				)
			);
			setEditMode(false);
			setEditingHolidayId(null);
		} else {
			// Add new holiday to pending batch
			const tempId = Date.now(); // Use timestamp as temporary ID
			setPendingHolidays([
				...pendingHolidays,
				{ ...currentHoliday, tempId },
			]);
		}

		// Clear form for next entry
		setCurrentHoliday({
			date: formatDateForInput(new Date()),
			title: "",
			location: currentHoliday.location,
		});
	};

	const handleEditPendingHoliday = (holiday) => {
		setCurrentHoliday({
			date: holiday.date,
			title: holiday.title,
			location: holiday.location,
		});
		setEditMode(true);
		setEditingHolidayId(holiday.tempId);
	};

	const handleRemovePendingHoliday = (tempId) => {
		setPendingHolidays(pendingHolidays.filter((h) => h.tempId !== tempId));
	};

	const handleSaveBatch = async () => {
		if (pendingHolidays.length === 0) {
			alert("No holidays to save");
			console.error("No holidays to save");
			return;
		}

		// Here you would typically make an API call to save the batch
		// For now, we'll just add them to our local state
		try {
			// Remove tempId and add required fields
			const holidaysWithMeta = pendingHolidays.map(
				({ tempId, ...rest }) => ({
					...rest,
				})
			);

			const addHolidaysResponse = await fetch(
				`${API_BASE_URL_LM}/api/holiday/`,
				{
					method: "POST",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify({ holidays: holidaysWithMeta }),
				}
			);

			if (!addHolidaysResponse.ok) {
				console.error("Unable to save holidays in backend");
			}

			const holidaysResponse = addHolidaysResponse.json();
		} catch (error) {
			console.error("Internal server error:", error);
		}

		const newHolidays = pendingHolidays.map((holiday, index) => {
			const newId = Math.max(0, ...holidays.map((h) => h.id)) + index + 1;
			return {
				id: newId,
				date: holiday.date,
				title: holiday.title,
				location: holiday.location,
			};
		});

		setHolidays([...holidays, ...newHolidays]);
		setPendingHolidays([]);
		setShowAddForm(false);
		alert("Holidays saved successfully!");
	};

	const handleCancelBatch = () => {
		if (pendingHolidays.length > 0) {
			if (
				window.confirm(
					"Are you sure you want to cancel? All unsaved holidays will be lost."
				)
			) {
				setPendingHolidays([]);
				setShowAddForm(false);
				setCurrentHoliday({ date: "", title: "", location: "" });
			}
		} else {
			setShowAddForm(false);
			setCurrentHoliday({ date: "", title: "", location: "" });
		}
	};

	const handleDeleteHoliday = async (holiday) => {
		try {
			if (
				window.confirm("Are you sure you want to delete this holiday?")
			) {
				// Send request to delete the holiday in the backend
				const deleteResponse = await fetch(
					`${API_BASE_URL_LM}/api/holiday/${holiday.id}`,
					{
						method: "DELETE",
						headers: { "Content-type": "application/json" },
					}
				);

				if (!deleteResponse.ok) {
					console.error("Failed to delete holiday");
					alert("Failed to delete holiday");
					return;
				}

				// Update local state by removing the deleted holiday
				setHolidays(holidays.filter((h) => h.id !== holiday.id));
				alert("Holiday deleted successfully!");
			}
		} catch (error) {
			console.error("Error deleting holiday:", error);
			alert("Error deleting holiday");
		}
	};

	// 2. Add this function to handle the edit button click
	const handleEditHoliday = (holiday) => {
		setEditingHoliday({ ...holiday });
		setShowEditModal(true);
	};

	// 3. Add this function to handle the update
	const handleUpdateHoliday = async () => {
		if (
			!editingHoliday.title ||
			!editingHoliday.date ||
			!editingHoliday.location
		) {
			alert("Please fill in all fields");
			return;
		}

		try {
			// Send update request to backend
			const updateResponse = await fetch(
				`${API_BASE_URL_LM}/api/holiday/`,
				{
					method: "PUT",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify(editingHoliday),
				}
			);

			if (!updateResponse.ok) {
				console.error("Unable to update holiday in backend");
				alert("Failed to update holiday");
				return;
			}

			// Update local state
			setHolidays(
				holidays.map((h) =>
					h.id === editingHoliday.id ? editingHoliday : h
				)
			);
			setShowEditModal(false);
			setEditingHoliday(null);
			alert("Holiday updated successfully!");
		} catch (error) {
			console.error("Error updating holiday:", error);
			alert("Error updating holiday");
		}
	};

	const handleDateClick = (day) => {
		const newDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			day
		);
		const formattedDate = formatDateForInput(newDate);
		setCurrentHoliday({
			...currentHoliday,
			date: formattedDate,
		});
		setShowCalendar(false);
	};

	const handlePrevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		);
	};

	const handleNextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
		);
	};

	const renderCalendar = () => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();

		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const monthName = new Date(year, month, 1).toLocaleString("default", {
			month: "long",
		});

		const days = [];
		for (let i = 0; i < firstDay; i++) {
			days.push(
				<div key={`empty-${i}`} className="calendar-day empty"></div>
			);
		}

		for (let i = 1; i <= daysInMonth; i++) {
			const isCurrentDay =
				i === new Date().getDate() &&
				month === new Date().getMonth() &&
				year === new Date().getFullYear();

			const dateStr = `${year}-${String(month + 1).padStart(
				2,
				"0"
			)}-${String(i).padStart(2, "0")}`;
			const isHoliday = holidays.some((h) => h.date === dateStr);

			days.push(
				<div
					key={i}
					className={`calendar-day ${
						isCurrentDay ? "current-day" : ""
					} ${isHoliday ? "holiday" : ""}`}
					onClick={() => handleDateClick(i)}
				>
					{i}
				</div>
			);
		}

		return (
			<div className="calendar-popup">
				<div className="calendar-header">
					<button onClick={handlePrevMonth}>
						<ChevronLeft size={16} />
					</button>
					<div>
						{monthName} {year}
					</div>
					<button onClick={handleNextMonth}>
						<ChevronRight size={16} />
					</button>
				</div>
				<div className="calendar-weekdays">
					<div>Su</div>
					<div>Mo</div>
					<div>Tu</div>
					<div>We</div>
					<div>Th</div>
					<div>Fr</div>
					<div>Sa</div>
				</div>
				<div className="calendar-days">{days}</div>
			</div>
		);
	};

	// 4. Add the edit modal component before the return statement closing bracket
	const renderEditModal = () => {
		if (!showEditModal || !editingHoliday) return null;

		return (
			<div className="modal-overlay">
				<div className="edit-modal">
					<div className="modal-header">
						<h3>Edit Holiday</h3>
						<button
							className="close-modal"
							onClick={() => setShowEditModal(false)}
						>
							<X size={20} />
						</button>
					</div>

					<div className="modal-body">
						<div className="form-group">
							<label>Date</label>
							<div className="date-input-container">
								<input
									type="date"
									value={editingHoliday.date}
									onChange={(e) =>
										setEditingHoliday({
											...editingHoliday,
											date: e.target.value,
										})
									}
								/>
							</div>
						</div>

						<div className="form-group">
							<label>Holiday Name</label>
							<input
								type="text"
								value={editingHoliday.title || ""}
								onChange={(e) =>
									setEditingHoliday({
										...editingHoliday,
										title: e.target.value,
									})
								}
								placeholder="Enter holiday title"
							/>
						</div>

						<div className="form-group">
							<label>Location</label>
							<select
								value={editingHoliday.location || "Global"}
								onChange={(e) =>
									setEditingHoliday({
										...editingHoliday,
										location: e.target.value,
									})
								}
							>
								{locations
									.filter((loc) => loc !== "All")
									.map((location) => (
										<option key={location} value={location}>
											{location}
										</option>
									))}
							</select>
						</div>
					</div>

					<div className="modal-footer">
						<button
							className="update-btn"
							onClick={handleUpdateHoliday}
						>
							Update Holiday
						</button>
						<button
							className="cancel-btn"
							onClick={() => setShowEditModal(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	};

	useEffect(() => {
		async function fetchHolidays() {
			try {
				const response = await fetch(
					`${API_BASE_URL_LM}/api/holiday/`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch holidays");
				}
				const data = await response.json();
				setHolidays(data);
			} catch (error) {
				console.error("Error fetching holidays:", error);
				setError("Error fetching holidays");
			}
		}
		fetchHolidays();
	}, []);

	return (
		<div className="holiday-calendar-container">
			<div className="header">
				<h2>Holiday Calendar</h2>
			</div>

			<div className="calendar-header">
				<div className="holiday-filters">
					<div className="filter">
						<label>Year</label>
						<select
							value={selectedYear}
							onChange={(e) =>
								setSelectedYear(
									e.target.value === "All"
										? "All"
										: parseInt(e.target.value)
								)
							}
						>
							<option value="All">All</option>
							{years.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>

					<div className="filter">
						<label>Month</label>
						<select
							value={selectedMonth}
							onChange={(e) => setSelectedMonth(e.target.value)}
						>
							{months.map((month) => (
								<option key={month} value={month}>
									{month}
								</option>
							))}
						</select>
					</div>

					{/* <div className="filter">
						<label>Department</label>
						<select
							value={selectedDepartment}
							onChange={(e) => setSelectedDepartment(e.target.value)}
						>
							{departments.map((dept) => (
								<option key={dept} value={dept}>
									{dept}
								</option>
							))}
						</select>
					</div> */}

					<div className="filter">
						<label>Location</label>
						<select
							value={selectedLocation}
							onChange={(e) =>
								setSelectedLocation(e.target.value)
							}
						>
							{locations.map((location) => (
								<option key={location} value={location}>
									{location}
								</option>
							))}
						</select>
					</div>
				</div>

				<button
					className="add-holiday-btn"
					onClick={handleAddHolidayForm}
					disabled={showAddForm}
				>
					<Plus size={20} color="#fff" /> Add Holiday
				</button>
			</div>

			{showAddForm ? (
				<div className="batch-holiday-form">
					<h3>Add Holidays in Batch</h3>

					<div className="form-container">
						<div className="add-form">
							<div className="form-group">
								<label>Date</label>
								<div className="date-input-container">
									<input
										type="text"
										value={formatDateForDisplay(
											currentHoliday.date
										)}
										readOnly
									/>
									<button
										className="calendar-toggle"
										onClick={() =>
											setShowCalendar(!showCalendar)
										}
									>
										<Calendar size={16} />
									</button>
									{showCalendar && renderCalendar()}
								</div>
							</div>

							<div className="form-group">
								<label>Holiday Name</label>
								<input
									type="text"
									value={currentHoliday.title || ""}
									onChange={(e) =>
										setCurrentHoliday({
											...currentHoliday,
											title: e.target.value,
										})
									}
									placeholder="Enter holiday title"
								/>
							</div>

							<div className="form-group">
								<label>Location</label>
								<select
									value={currentHoliday.location || "Global"}
									onChange={(e) =>
										setCurrentHoliday({
											...currentHoliday,
											location: e.target.value,
										})
									}
								>
									{locations
										.filter((loc) => loc !== "All")
										.map((location) => (
											<option
												key={location}
												value={location}
											>
												{location}
											</option>
										))}
								</select>
							</div>

							<div className="form-single-actions">
								<button
									className="add-to-batch-btn"
									onClick={handleAddToBatch}
								>
									{editMode
										? "Update Holiday"
										: "Add to Batch"}
								</button>
							</div>
						</div>

						{pendingHolidays.length > 0 && (
							<div className="pending-holidays">
								<h4>Pending Holidays</h4>
								<div className="pending-list">
									{pendingHolidays.map((holiday) => (
										<div
											key={holiday.tempId}
											className="pending-item"
										>
											<div className="pending-details">
												<span className="pending-date">
													{formatDateForDisplay(
														holiday.date
													)}
												</span>
												<span className="pending-title">
													{holiday.title}
												</span>
												<span className="pending-location">
													{holiday.location}
												</span>
											</div>
											<div className="pending-actions">
												<button
													className="edit-pending-btn"
													onClick={() =>
														handleEditPendingHoliday(
															holiday
														)
													}
												>
													Edit
												</button>
												<button
													className="remove-pending-btn"
													onClick={() =>
														handleRemovePendingHoliday(
															holiday.tempId
														)
													}
												>
													<Trash2 size={16} />
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="batch-actions">
						<button
							className="save-batch-btn"
							onClick={handleSaveBatch}
							disabled={pendingHolidays.length === 0}
						>
							<Save size={16} /> Save All Holidays
						</button>
						<button
							className="cancel-batch-btn"
							onClick={handleCancelBatch}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="holidays-table">
					<table>
						<thead>
							<tr>
								<th>Date</th>
								<th>Name</th>
								<th>Location</th>
								<th>Created On</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredHolidays.map((holiday) => (
								<tr key={holiday.id}>
									<td>
										{formatDateForDisplay(holiday.date)}
									</td>
									<td>{holiday.title}</td>
									<td>{holiday.location}</td>
									<td>{formatDateForDisplay(holiday.createdAt)}</td>
									<td className="actions">
										{/* Replace the existing edit button in the table */}
										<button
											className="edit-btn"
											onClick={() =>
												handleEditHoliday(holiday)
											}
										>
											Edit
										</button>
										<button
											className="delete-btn"
											onClick={() => handleDeleteHoliday(holiday)}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
							{filteredHolidays.length === 0 && (
								<tr>
									<td colSpan="5" className="no-records">
										No holidays found for the selected
										filters
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* Add this right before the main closing div */}
			{renderEditModal()}
		</div>
	);
}

export default CreateHoliday;
