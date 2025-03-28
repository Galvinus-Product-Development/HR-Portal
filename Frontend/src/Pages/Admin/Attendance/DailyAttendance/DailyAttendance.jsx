import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./DailyAttendance.css";

const API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
const DailyAttendance = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    department: "",
    status: "",
  });
  const [employees, setEmployees] = useState([]);
  const [todayLeaveRecords, setTodayLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Set today's date parameters for fetching leave records
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentDay = today.getDate();
  const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // Convert UTC to IST

  // API base URLs for different services
  const ATTENDANCE_API_BASE_URL = `${API_BASE_URL_AT}/api`;
  const LEAVE_API_BASE_URL = `${API_BASE_URL_LM}/api`;

  // Helper function to convert minutes to "0h 00m" format
  const formatWorkingHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  // Fetch employees when component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Extract available locations and departments
  useEffect(() => {
    if (employees.length > 0) {
      const uniqueLocations = [
        ...new Set(employees.map((emp) => emp.location).filter(Boolean)),
      ];
      const uniqueDepartments = [
        ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
      ];

      setLocations(uniqueLocations);
      setDepartments(uniqueDepartments);
    }
  }, [employees]);

  // Fetch today's leave records
  useEffect(() => {
    const fetchTodayLeaveRecords = async () => {
      try {
        // Fetch the leave records for the current month
        const response = await fetch(
          `${LEAVE_API_BASE_URL}/leave-history?year=${currentYear}&month=${currentMonth}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch today's leave records");
        const data = await response.json();

        // Filter to keep only records that match the current day
        const todaysRecords = data.filter((record) => {
          const recordDate = new Date(record.appliedOn);
          return (
            recordDate.getDate() === today.getDate() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === currentYear &&
            (record.status === "PAID" || record.status === "UNPAID")
          );
        });

        setTodayLeaveRecords(todaysRecords);
      } catch (error) {
        console.error("Error fetching leave records:", error);
      }
    };

    fetchTodayLeaveRecords();
  }, [currentYear, currentMonth, currentDay]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the getAllEmployees endpoint from employeeRoutes.js
      const response = await fetch(`${ATTENDANCE_API_BASE_URL}/employees`);

      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      department: "",
      status: "",
    });
  };

  // Get today's attendance for an employee
  const getTodayAttendance = (employee) => {
    if (!employee.attendance || employee.attendance.length === 0) {
      return null;
    }

    return employee.attendance.find(
      (att) => new Date(att.date).toDateString() === today.toDateString()
    );
  };

  // Determine employee status
  const getEmployeeStatus = (employee) => {
    const hasLeaveRecord = todayLeaveRecords.some(
      (record) => record.employeeId === employee.id
    );

    if (hasLeaveRecord) return "On Leave";

    const todayAttendance = getTodayAttendance(employee);
    return todayAttendance ? todayAttendance.attendanceStatus : "Not Marked";
  };

  // Modified filtering logic
  const filteredEmployees = employees.filter((employee) => {
    const status = getEmployeeStatus(employee);

    return (
      (!filters.location || employee.location === filters.location) &&
      (!filters.department || employee.department === filters.department) &&
      (!filters.status || status === filters.status)
    );
  });

  // Compute summary counts
  const attendanceCounts = {
    present: employees.filter((emp) => getEmployeeStatus(emp) === "Present")
      .length,
    absent: employees.filter((emp) => getEmployeeStatus(emp) === "Absent")
      .length,
    halfDay: employees.filter((emp) => getEmployeeStatus(emp) === "Half Day")
      .length,
    onLeave: employees.filter((emp) => getEmployeeStatus(emp) === "On Leave")
      .length,
  };

  // Modal component
  const AttendanceModal = () => {
    if (!selectedEmployee) return null;

    const todayAttendance = getTodayAttendance(selectedEmployee);

    return (
      <div className="modal-backdrop">
        <div className="attendance-modal">
          <div className="modal-header">
            <h3>Employee Attendance Details</h3>
            <button onClick={() => setShowAttendanceModal(false)}>×</button>
          </div>
          <div className="modal-content">
            <h4>{selectedEmployee.name}</h4>
            <p>Department: {selectedEmployee.department || "Not assigned"}</p>
            <p>Job Title: {selectedEmployee.jobTitle || "Not assigned"}</p>
            <p>Location: {selectedEmployee.location || "Not assigned"}</p>

            <h4>Today's Attendance</h4>
            {todayAttendance ? (
              <div>
                <p>Status: {todayAttendance.attendanceStatus}</p>
                <p>
                  Punch In:{" "}
                  {new Date(todayAttendance.punchInTime).toLocaleTimeString()}
                </p>
                <p>
                  Punch Out:{" "}
                  {todayAttendance.punchOutTime
                    ? new Date(
                        todayAttendance.punchOutTime
                      ).toLocaleTimeString()
                    : "Not punched out"}
                </p>
                <p>Punch In Method: {todayAttendance.punchInMethod}</p>
                <p>Working Hours: {todayAttendance.workingHours || 0} hours</p>
                {todayAttendance.lateComing > 0 && (
                  <p>
                    Late by: {Math.floor(todayAttendance.lateComing / 60)}{" "}
                    minutes
                  </p>
                )}
                {todayAttendance.overtime > 0 && (
                  <p>Overtime: {todayAttendance.overtime} hours</p>
                )}
              </div>
            ) : (
              <p>No attendance record for today</p>
            )}

            <h4>Monthly Statistics</h4>
            {selectedEmployee.monthlyAttendanceStats &&
            selectedEmployee.monthlyAttendanceStats.length > 0 ? (
              <div>
                <p>
                  Month: {selectedEmployee.monthlyAttendanceStats[0].monthYear}
                </p>
                <p>
                  Working Days:{" "}
                  {selectedEmployee.monthlyAttendanceStats[0].workingDays}
                </p>
                <p>
                  Present Days:{" "}
                  {selectedEmployee.monthlyAttendanceStats[0].presentDays}
                </p>
                <p>
                  Absent Days:{" "}
                  {selectedEmployee.monthlyAttendanceStats[0].absentDays}
                </p>
                <p>
                  Half Days:{" "}
                  {selectedEmployee.monthlyAttendanceStats[0].halfDays}
                </p>
                <p>
                  Late Days:{" "}
                  {selectedEmployee.monthlyAttendanceStats[0].lateDays}
                </p>
              </div>
            ) : (
              <p>No monthly statistics available</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading employee data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="daily-attendance__container">
      <div className="daily-attendance__header">
        <h2>Daily Attendance</h2>
        <p className="leave-subtitle">
          {filteredEmployees.length === 0
            ? "Waiting for employees to mark attendance"
            : "Track and review daily attendance records"}
        </p>
      </div>

      <div className="daily-attendance__summary-grid">
        <div className="daily-attendance__summary-card present">
          <p>Present</p>
          <p>{attendanceCounts.present}</p>
        </div>
        <div className="daily-attendance__summary-card absent">
          <p>Absent</p>
          <p>{attendanceCounts.absent}</p>
        </div>
        <div className="daily-attendance__summary-card half-day">
          <p>Half Day</p>
          <p>{attendanceCounts.halfDay}</p>
        </div>
        <div className="daily-attendance__summary-card on-leave">
          <p>On Leave</p>
          <p>{attendanceCounts.absent}</p>
        </div>
      </div>

      <div className="daily-attendance__filters">
        <div className="filter-group">
          <label>Location:</label>
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Department:</label>
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Half Day">Half Day</option>
            <option value="On Leave">On Leave</option>
            <option value="Not Marked">Not Marked</option>
          </select>
        </div>
        <button className="reset-filters" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="daily-attendance__table-container">
          <table className="daily-attendance__table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th>Punch In</th>
                <th>Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => {
                const todayAttendance = getTodayAttendance(employee);
                const status = getEmployeeStatus(employee);

                return (
                  <tr
                    key={employee.id}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowAttendanceModal(true);
                    }}
                    className={status.toLowerCase().replace(" ", "-")}
                  >
                    <td>{employee.name}</td>
                    <td>{employee.department || "-"}</td>
                    <td>{employee.location || "-"}</td>
                    <td>{status}</td>
                    <td>
                      {todayAttendance?.punchInTime
                        ? new Date(
                            new Date(todayAttendance.punchInTime).getTime() -
                              ISTOffsetMs
                          ).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td>
                      {todayAttendance?.punchOutTime
                        ? new Date(
                            new Date(todayAttendance.punchOutTime).getTime() -
                              ISTOffsetMs
                          ).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td>
                      {todayAttendance?.workingHours
                        ? formatWorkingHours(todayAttendance.workingHours)
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="daily-attendance__no-data">
          <p>
            No attendance records for today. Employees need to mark their
            attendance.
          </p>
        </div>
      )}

      {showAttendanceModal && <AttendanceModal />}
    </div>
  );
};

export default DailyAttendance;
