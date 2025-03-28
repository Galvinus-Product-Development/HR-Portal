import React, { useState, useEffect } from "react";
import "./AttendanceDashboard.css";
const API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
const API_BASE_URL_LM= import.meta.env.VITE_API_BASE_URL_LM;
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
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch leave history whenever the month filter changes.
  useEffect(() => {
    fetchLeaveHistory();
  }, [filters.month]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL_AT}/api/employees`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch employee data: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("Fetched employees:---------", data);
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchLeaveHistory = async () => {
    try {
      const currentYear = new Date().getFullYear();

      // Use the appropriate endpoint based on your backend structure
      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-history?year=${currentYear}&month=${filters.month}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch leave history data: ${response.statusText}`
        );
      }

      const data = await response.json();
      setLeaveHistory(data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
      setError(`Error fetching leave history: ${error.message}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Helper function to format minutes to "0h 00m" format
  const formatTimeToHoursMinutes = (totalMinutes) => {
    if (totalMinutes === 0 || !totalMinutes) return "0h 00m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  };

  // Compute monthly leave counts for a given employee
  const getMonthlyLeaveCounts = (employeeId) => {
    // Match employee ID in the leave history data
    const employeeLeaves = leaveHistory.filter(
      (record) => record.employeeId === employeeId
    );

    // Use the paidLeave and unpaidLeave values from the leave history
    const paid = employeeLeaves.reduce(
      (sum, record) => sum + (record.paidLeave || 0),
      0
    );
    const unpaid = employeeLeaves.reduce(
      (sum, record) => sum + (record.unpaidLeave || 0),
      0
    );

    // Only reset if we're viewing the current month AND it's the first day of that month
    const shouldReset =
      filters.month === currentDate.getMonth() + 1 &&
      currentDate.getDate() === 1;

    return {
      paid: shouldReset ? 0 : paid,
      unpaid: shouldReset ? 0 : unpaid,
    };
  };

  // Compute weekly leave counts for a given employee
  const getWeeklyLeaveCounts = (employeeId) => {
    // Match employee ID in the leave history data
    const employeeLeaves = leaveHistory.filter(
      (record) => record.employeeId === employeeId
    );

    // Initialize weeks 1 to 5
    const weeks = {
      1: { paid: 0, unpaid: 0 },
      2: { paid: 0, unpaid: 0 },
      3: { paid: 0, unpaid: 0 },
      4: { paid: 0, unpaid: 0 },
      5: { paid: 0, unpaid: 0 },
    };

    // Only reset if we're viewing the current month AND it's the first day of that month
    const shouldReset =
      filters.month === currentDate.getMonth() + 1 &&
      currentDate.getDate() === 1;

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

  // Get the number of half days for an employee
  const getHalfDays = (employee) => {
    // Check if monthlyAttendanceStats exists and has data for the current month
    if (
      employee.monthlyAttendanceStats &&
      employee.monthlyAttendanceStats.length > 0
    ) {
      const currentMonthStats = employee.monthlyAttendanceStats.find(
        (stats) =>
          stats.monthYear === `${new Date().getFullYear()}-${filters.month}`
      );

      if (currentMonthStats) {
        return currentMonthStats.halfDays || 0;
      }
    }
    return 0;
  };

  // Get the number of present days for an employee
  const getPresentDays = (employee) => {
    // Check if monthlyAttendanceStats exists and has data for the current month
    if (
      employee.monthlyAttendanceStats &&
      employee.monthlyAttendanceStats.length > 0
    ) {
      const currentMonthStats = employee.monthlyAttendanceStats.find(
        (stats) =>
          stats.monthYear === `${new Date().getFullYear()}-${filters.month}`
      );

      if (currentMonthStats) {
        return currentMonthStats.presentDays || 0;
      }
    }

    // Fallback to counting from attendance records
    return employee.attendance
      ? employee.attendance.reduce(
          (sum, record) =>
            sum + (record.attendanceStatus === "Present" ? 1 : 0),
          0
        )
      : 0;
  };

  // Handle downloading attendance report
  const handleDownloadReport = () => {
    setIsExporting(true);

    try {
      // Create CSV content
      let csvContent =
        "Employee Name,Employee ID,Job Title,Phone Number,Location,Department,Present,Absent,Half Day,Week Off,Paid Leave,Unpaid Leave,Overtime,Working Hours,Late Coming,Early Leaving\n";

      filteredEmployees.forEach((employee) => {
        const { paid, unpaid } = getMonthlyLeaveCounts(employee.id);
        const presentDays = getPresentDays(employee);
        const halfDays = getHalfDays(employee);
        const weekOffs = getWeekendDaysInMonth();
        const totalAbsences = paid + unpaid;

        const overtimeHours = employee.attendance
          ? employee.attendance.reduce(
              (sum, record) => sum + (record.overtime || 0),
              0
            )
          : 0;

        const workingHours = employee.attendance
          ? formatTimeToHoursMinutes(
              employee.attendance.reduce(
                (sum, record) => sum + (record.workingHours || 0),
                0
              )
            )
          : "0h 00m";

        const lateComing = employee.attendance
          ? formatTimeToHoursMinutes(
              employee.attendance.reduce(
                (sum, record) => sum + (record.lateComing || 0),
                0
              )
            )
          : "0h 00m";

        const earlyLeaving = employee.attendance
          ? formatTimeToHoursMinutes(
              employee.attendance.reduce(
                (sum, record) => sum + (record.earlyLeaving || 0),
                0
              )
            )
          : "0h 00m";

        // Add row to CSV
        csvContent += `${employee.name},${employee.id},${employee.jobTitle},${employee.phone},${employee.location},${employee.department},${presentDays},${totalAbsences},${halfDays},${weekOffs},${paid},${unpaid},${overtimeHours},${workingHours},${lateComing},${earlyLeaving}\n`;
      });

      // Create download link
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `attendance_report_${filters.month}_${new Date().getFullYear()}.csv`
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    }

    setIsExporting(false);
  };

  // Filter employees using the filters for location, department, and name
  const filteredEmployees = employees.filter((emp) => {
    return (
      (!filters.location || emp.location === filters.location) &&
      (!filters.department || emp.department === filters.department) &&
      (!filters.name ||
        emp.name.toLowerCase().includes(filters.name.toLowerCase()))
    );
  });

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (errorLeaveHistory) return <p>Error: {errorLeaveHistory}</p>;

  // Calculate week offs once for all employees
  const weekOffs = getWeekendDaysInMonth();

  return (
    <div className="attendance-dashboard-container">
      <div className="attendance-dashboard-header">
        <div className="header-part">
          <h2>Attendance Dashboard</h2>
          <p className="attendance-dashboard-subtitle">
            Monitor and track daily attendance and leave history insights
            effortlessly.
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          disabled={isExporting || filteredEmployees.length === 0}
        >
          {isExporting ? "Exporting..." : "Download Report"}
        </button>
      </div>
      {/* Filters section displayed in a single line */}
      <div
        className="attendance-dashboard-filters"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div className="filter-group">
          <label>Location</label>
          <select
            name="location"
            onChange={handleFilterChange}
            value={filters.location}
          >
            <option value="">All Locations</option>
            {[...new Set(employees.map((emp) => emp.location))].map(
              (location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              )
            )}
          </select>
        </div>
        <div className="filter-group">
          <label>Department</label>
          <select
            name="department"
            onChange={handleFilterChange}
            value={filters.department}
          >
            <option value="">All Departments</option>
            {[...new Set(employees.map((emp) => emp.department))].map(
              (department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              )
            )}
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
          <select
            name="month"
            onChange={handleFilterChange}
            value={filters.month}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Display Mode</label>
          <select
            name="displayMode"
            onChange={handleFilterChange}
            value={filters.displayMode}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="no-data-message">
          No employees found matching your filters.
        </div>
      ) : (
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
                // Calculate leave counts based on display mode
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
                  paidLeaves = Object.values(weeklyCounts).reduce(
                    (sum, week) => sum + week.paid,
                    0
                  );
                  unpaidLeaves = Object.values(weeklyCounts).reduce(
                    (sum, week) => sum + week.unpaid,
                    0
                  );

                  leaveCells = [1, 2, 3, 4, 5].map((week) => (
                    <React.Fragment key={week}>
                      <td>{weeklyCounts[week].paid}</td>
                      <td>{weeklyCounts[week].unpaid}</td>
                    </React.Fragment>
                  ));
                }

                // Calculate total absences as sum of paid and unpaid leaves
                const totalAbsences = paidLeaves + unpaidLeaves;

                // Get half days from monthly stats or default to 0
                const halfDays = getHalfDays(employee);

                // Get present days from monthly stats or count from attendance records
                const presentDays = getPresentDays(employee);

                return (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.id}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.location}</td>
                    <td>{employee.department}</td>
                    <td>{presentDays}</td>
                    <td>{totalAbsences}</td>
                    <td>{halfDays}</td>
                    <td>{weekOffs}</td>
                    {/* Render leave history cells */}
                    {leaveCells}
                    <td>
                      {employee.attendance
                        ? employee.attendance.reduce(
                            (sum, record) => sum + (record.overtime || 0),
                            0
                          )
                        : 0}
                    </td>
                    <td>
                      {formatTimeToHoursMinutes(
                        employee.attendance
                          ? employee.attendance.reduce(
                              (sum, record) => sum + (record.workingHours || 0),
                              0
                            )
                          : 0
                      )}
                    </td>
                    <td>
                      {formatTimeToHoursMinutes(
                        employee.monthlyAttendanceStats
                          ? employee.monthlyAttendanceStats.reduce(
                              (sum, record) =>
                                sum + (record.monthlyLateComing || 0),
                              0
                            )
                          : 0
                      )}
                    </td>
                    <td>
                      {formatTimeToHoursMinutes(
                        employee.attendance
                          ? employee.attendance.reduce(
                              (sum, record) => sum + (record.earlyLeaving || 0),
                              0
                            )
                          : 0
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
