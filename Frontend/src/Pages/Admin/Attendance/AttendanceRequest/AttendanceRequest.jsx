import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import "./AttendanceRequest.css";
const API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
const AttendanceRequest = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All Status");
	const [departmentFilter, setDepartmentFilter] = useState("Department");
	const [locationFilter, setLocationFilter] = useState("Location");
	const [attendanceRequests, setAttendanceRequests] = useState([]);
	const [loading, setLoading] = useState(true);

	// Dropdowns state
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
	const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
		useState(false);
	const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

	// Fetch real attendance-requests from backend
	useEffect(() => {
		const fetchRequests = async () => {
			setLoading(true);

			try {
				const response = await fetch(
					`${API_BASE_URL_AT}/api/attendanceRequest`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch attendance requests");
				}

				// Our controller returns an array of employees with `attendanceRequest: []`
				const employees = await response.json();

				// Flatten them into one flat list of requests:
				const requests = employees.flatMap((emp) =>
					(emp.attendanceRequest || []).map((req) => ({
						...req,
						employeeName: emp.name,
						employeeId: emp.id,
						department: emp.department,
						location: emp.location,
					}))
				);

				setAttendanceRequests(requests);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchRequests();
	}, []);

	// Toggle dropdown visibility
	const toggleDropdown = (dropdown) => {
		if (dropdown === "status") {
			setIsStatusDropdownOpen(!isStatusDropdownOpen);
			setIsDepartmentDropdownOpen(false);
			setIsLocationDropdownOpen(false);
		} else if (dropdown === "department") {
			setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen);
			setIsStatusDropdownOpen(false);
			setIsLocationDropdownOpen(false);
		} else if (dropdown === "location") {
			setIsLocationDropdownOpen(!isLocationDropdownOpen);
			setIsStatusDropdownOpen(false);
			setIsDepartmentDropdownOpen(false);
		}
	};

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle filter selections
	const handleStatusSelect = (status) => {
		setStatusFilter(status);
		setIsStatusDropdownOpen(false);
	};

	const handleDepartmentSelect = (department) => {
		setDepartmentFilter(department);
		setIsDepartmentDropdownOpen(false);
	};

	const handleLocationSelect = (location) => {
		setLocationFilter(location);
		setIsLocationDropdownOpen(false);
	};

	// Handle approve/reject actions
	const handleApprove = async (request) => {
		try {
			const res = await fetch(
				`${API_BASE_URL_AT}/api/attendanceRequest/${request.id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						employeeId: request.employeeId,
						attendanceDate: request.attendanceDate,
						punchInTime: request.punchInTime,
						punchOutTime: request.punchOutTime,
						status: "Approved"
					}),
				}
			);

			console.log(res)

			if (!res.ok) throw new Error("Failed to approve");

			// Optimistically update UI:
			setAttendanceRequests((reqs) =>
				reqs.map((r) =>
					r?.id === id ? { ...r, status: "Approved" } : r
				)
			);
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	};

	const handleReject = async (request) => {
		try {
			const res = await fetch(
				`${API_BASE_URL_AT}/api/attendanceRequest/${request.id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						employeeId: request.employeeId,
						attendanceDate: request.attendanceDate,
						punchInTime: request.punchInTime,
						punchOutTime: request.punchOutTime,
						status: "Rejected"
					}),
				}
			);

			if (!res.ok) throw new Error("Failed to reject");
			
			setAttendanceRequests((reqs) =>
				reqs.map((r) =>
					r.id === id ? { ...r, status: "Rejected" } : r
				)
			);
		} catch (err) {
			console.error(err);
		}
	};

	// Filter attendance requests based on search and filters
	const filteredRequests = attendanceRequests.filter((request) => {
		const matchesSearch =
			searchTerm === "" ||
			`${request.employeeName} ${request.employeeId}`
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "All Status" || request.status === statusFilter;

		const matchesDepartment =
			departmentFilter === "Department" ||
			request.department === departmentFilter;

		const matchesLocation =
			locationFilter === "Location" ||
			request.location === locationFilter;

		return (
			matchesSearch &&
			matchesStatus &&
			matchesDepartment &&
			matchesLocation
		);
	});

	const formatDate = (dateString) => {
		const date = String(new Date(dateString).getDate()).padStart(2, "0");
		const month = String(new Date(dateString).getMonth() + 1).padStart(2, "0");
		const year = new Date(dateString).getFullYear();
		return `${date}-${month}-${year}`;
	};

	// Lists for dropdowns
	const statuses = ["All Status", "Approved", "Rejected", "Pending"];
	const departments = ["Department", "HR", "Testing", "Security"];
	const locations = ["Location", "Bengaluru", "Silchar"];

	return (
		<div className="attendance-request-container1">
			<h1>Attendance Request</h1>

			<div className="filters-container">
				<div className="search-container">
					<Search size={18} className="search-icon" />
					<input
						type="text"
						placeholder="Search Employee Name & ID"
						value={searchTerm}
						onChange={handleSearchChange}
						className="search-input"
					/>
				</div>

				<div className="dropdown-container">
					<div className="dropdown">
						<button
							className="dropdown-toggle"
							onClick={() => toggleDropdown("status")}
						>
							{statusFilter} <ChevronDown size={16} />
						</button>
						{isStatusDropdownOpen && (
							<div className="dropdown-menu">
								{statuses.map((status) => (
									<div
										key={status}
										className={`dropdown-item ${
											statusFilter === status
												? "active"
												: ""
										}`}
										onClick={() =>
											handleStatusSelect(status)
										}
									>
										{status}
									</div>
								))}
							</div>
						)}
					</div>

					<div className="dropdown">
						<button
							className="dropdown-toggle"
							onClick={() => toggleDropdown("department")}
						>
							{departmentFilter} <ChevronDown size={16} />
						</button>
						{isDepartmentDropdownOpen && (
							<div className="dropdown-menu">
								{departments.map((department) => (
									<div
										key={department}
										className={`dropdown-item ${
											departmentFilter === department
												? "active"
												: ""
										}`}
										onClick={() =>
											handleDepartmentSelect(department)
										}
									>
										{department}
									</div>
								))}
							</div>
						)}
					</div>

					<div className="dropdown">
						<button
							className="dropdown-toggle"
							onClick={() => toggleDropdown("location")}
						>
							{locationFilter} <ChevronDown size={16} />
						</button>
						{isLocationDropdownOpen && (
							<div className="dropdown-menu">
								{locations.map((location) => (
									<div
										key={location}
										className={`dropdown-item ${
											locationFilter === location
												? "active"
												: ""
										}`}
										onClick={() =>
											handleLocationSelect(location)
										}
									>
										{location}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="table-container">
				<table className="attendance-table">
					<thead>
						<tr>
							<th>Employee Name & ID</th>
							<th>Department</th>
							<th>Location</th>
							<th>Requested on</th>
							<th>Attendance Date</th>
							<th>Punch In</th>
							<th>Punch Out</th>
							<th>Reason</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan="10" className="loading">
									Loading attendance requests...
								</td>
							</tr>
						) : filteredRequests.length === 0 ? (
							<tr>
								<td colSpan="10" className="no-data">
									No attendance requests found
								</td>
							</tr>
						) : (
							filteredRequests.map((request) => (
								<tr key={request.id}>
									<td>
										<div className="employee-info">
											<span className="employee-name">
												{request.employeeName}
											</span>
											<span className="employee-id">
												{request.employeeId}
											</span>
										</div>
									</td>
									<td>{request.department}</td>
									<td>{request.location}</td>
									<td>
										{request.requestDate
											? formatDate(request.requestDate)
											: "-"}
									</td>
									<td>
										{request.attendanceDate
											? formatDate(request.attendanceDate)
											: "-"}
									</td>
									<td>
										{request.punchInTime
											? new Date(
													request.punchInTime
											  ).toLocaleTimeString()
											: "-"}
									</td>
									<td>
										{request.punchOutTime
											? new Date(
													request.punchOutTime
											  ).toLocaleTimeString()
											: "-"}
									</td>
									<td>{request.reason}</td>
									<td>
										<span
											className={`status-badge ${request.status.toLowerCase()}`}
										>
											{request.status}
										</span>
									</td>
									<td>
										<div className="action-buttons">
											{(request.status === "Pending" || request.status === "Approved") && <button
												className="approve-button"
												onClick={() =>
													handleApprove(request)
												}
												disabled={request.status === "Approved"}
											>
												Approve
											</button>}
											{(request.status === "Pending" || request.status === "Rejected") && <button
												className="reject-button"
												onClick={() =>
													handleReject(request)
												}
												disabled={request.status === "Rejected"}
											>
												Reject
											</button>}
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AttendanceRequest;
