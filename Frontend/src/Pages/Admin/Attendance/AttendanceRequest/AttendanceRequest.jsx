import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import "./AttendanceRequest.css";

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

  // Mock data - In a real app, this would be fetched from an API
  useEffect(() => {
    setTimeout(() => {
      setAttendanceRequests([
        {
          id: 1,
          employeeName: "Shraddha",
          employeeId: "GAL000",
          department: "HR",
          location: "Bengaluru",
          requestedOn: "04-01-2025",
          attendanceDate: "03-01-2025",
          punchIn: "10:30:00",
          punchOut: "-",
          reason: "Forgot to Punch out",
          status: "Approved",
        },
        {
          id: 2,
          employeeName: "Salma",
          employeeId: "GAL101",
          department: "HR",
          location: "Bengaluru",
          requestedOn: "21-01-2025",
          attendanceDate: "21-01-2025",
          punchIn: "-",
          punchOut: "08:00:00",
          reason: "Forgot to Punch In",
          status: "Approved",
        },
        {
          id: 3,
          employeeName: "Rahi",
          employeeId: "GAL102",
          department: "Testing",
          location: "Bengaluru",
          requestedOn: "25-01-2025",
          attendanceDate: "02-02-2025",
          punchIn: "-",
          punchOut: "08:30:00",
          reason: "Forgot to Punch In",
          status: "Rejected",
        },
        {
          id: 4,
          employeeName: "Nivedita",
          employeeId: "GAL103",
          department: "Security",
          location: "Silchar",
          requestedOn: "24-02-2025",
          attendanceDate: "24-02-2025",
          punchIn: "08:00:00",
          punchOut: "-",
          reason: "Forgot to Punch In",
          status: "Approved",
        },
        {
          id: 5,
          employeeName: "Bhaskar",
          employeeId: "GAL105",
          department: "Testing",
          location: "Silchar",
          requestedOn: "25-01-2025",
          attendanceDate: "25-01-2025",
          punchIn: "-",
          punchOut: "08:30:00",
          reason: "Forgot to Punch In",
          status: "Approved",
        },
      ]);
      setLoading(false);
    }, 500);
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
  const handleApprove = (id) => {
    setAttendanceRequests(
      attendanceRequests.map((request) =>
        request.id === id ? { ...request, status: "Approved" } : request
      )
    );
  };

  const handleReject = (id) => {
    setAttendanceRequests(
      attendanceRequests.map((request) =>
        request.id === id ? { ...request, status: "Rejected" } : request
      )
    );
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
      locationFilter === "Location" || request.location === locationFilter;

    return (
      matchesSearch && matchesStatus && matchesDepartment && matchesLocation
    );
  });

  // Lists for dropdowns
  const statuses = ["All Status", "Approved", "Rejected", "Pending"];
  const departments = ["Department", "HR", "Testing", "Security"];
  const locations = ["Location", "Bengaluru", "Silchar"];

  return (
    <div className="attendance-request-container">
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
                      statusFilter === status ? "active" : ""
                    }`}
                    onClick={() => handleStatusSelect(status)}
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
                      departmentFilter === department ? "active" : ""
                    }`}
                    onClick={() => handleDepartmentSelect(department)}
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
                      locationFilter === location ? "active" : ""
                    }`}
                    onClick={() => handleLocationSelect(location)}
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
              <th>Punch IN</th>
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
                      <span className="employee-id">{request.employeeId}</span>
                    </div>
                  </td>
                  <td>{request.department}</td>
                  <td>{request.location}</td>
                  <td>{request.requestedOn}</td>
                  <td>{request.attendanceDate}</td>
                  <td>{request.punchIn}</td>
                  <td>{request.punchOut}</td>
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
                      <button
                        className="approve-button"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </button>
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
