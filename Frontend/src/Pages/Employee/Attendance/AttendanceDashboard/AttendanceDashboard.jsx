import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Timer,
  UserCheck,
  UserX,
  UserMinus,
  Wallet,
  WalletCards,
  Clock4,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./AttendanceDashboard.css";

// API base URL
const API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;

const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className={`att-stat-card ${color}`}>
      <div className="att-stat-card-content">
        <div>
          <p className="att-stat-title">{title}</p>
          <p className="att-stat-value">{value}</p>
          <p className="att-stat-subtitle">{subtitle}</p>
        </div>
        <div className="att-stat-icon">{icon}</div>
      </div>
    </div>
  );
}

export default function AttendanceDashboard() {
  const [viewType, setViewType] = useState("calendar");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [employeeData, setEmployeeData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    workingDays: 0,
    presentDays: 0,
    absentDays: 0,
    halfDays: 0,
    lateDays: 0,
    overtimeHours: 0,
    totalPaidLeaves: 0,
    totalUnpaidLeaves: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_LM}/api/holiday`);

        if (!response.ok) {
          console.error("Unable to fetch holidays");
        }

        const data = await response.json();
        setHolidays(data);
      } catch (error) {
        console.error("Internal server error:", error);
      }
    }

    fetchHolidays();
  }, []);

  // Get employee ID from localStorage
  const employeeId = localStorage.getItem("userId");
  const fetchLeaveRecords = async () => {
    try {
      const year = selectedMonth.getFullYear();
      const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");

      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-history/employee/${employeeId}/${year}/${month}`
      );

      if (!response.ok) {
        console.log("Leave API not available or error occurred");
        return;
      }

      const data = await response.json();
      // ✅ Update state correctly
      setLeaveRecords(
        data.map((record) => ({
          startDate: record.startDate,
          endDate: record.endDate,
          leaveType: record.leaveType,
          duration: record.duration,
        }))
      );

      // ✅ Check if leaveRecords updates
      setTimeout(() => console.log("Updated leaveRecords:", leaveRecords), 500);

      // ✅ Update monthly stats
      let totalPaidLeaves = 0;
      let totalUnpaidLeaves = 0;
      data.forEach((leaveHistory) => {
        totalPaidLeaves += leaveHistory.paidLeave;
        totalUnpaidLeaves += leaveHistory.unpaidLeave;
      });

      setMonthlyStats((prevStats) => ({
        ...prevStats,
        totalPaidLeaves,
        totalUnpaidLeaves,
      }));

    } catch (err) {
      console.error("Error fetching leave records:", err);
    }
  };

  // ✅ Debug Leave Records After Update
  useEffect(() => {
    console.log("useEffect triggered - Updated leaveRecords:", leaveRecords);
  }, [leaveRecords]);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL_AT}/api/employees/${employeeId}`
      );
      if (!response.ok) throw new Error("Failed to fetch employee data");

      const data = await response.json();

      // Set employee basic data
      setEmployeeData({
        id: data.id,
        name: data?.personalDetails.name,
        jobTitle: data?.employmentDetails.jobTitle,
        department: data?.employmentDetails.department,
        location: data?.personalDetails.location,
      });
      // Store full attendance records (for all months)
      setAttendanceData(data.attendance || []);
      // Set initial monthly stats based on the selected month
      updateMonthlyStats(data, selectedMonth);
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Fetch employee data with attendance and monthly stats once
  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  useEffect(() => {
    if (attendanceData.length) {
      updateMonthlyStats(
        { monthlyAttendanceStats: attendanceData },
        selectedMonth
      );
    }
  }, [selectedMonth, attendanceData]);

  // Fetch leave records for the selected month
  useEffect(() => {
    if (employeeData) {
      fetchLeaveRecords();
    }
  }, [selectedMonth, employeeId, employeeData]);

  const updateMonthlyStats = (data, selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const currentMonth = `${year}-${month}`;

    // Loop through monthlyAttendanceStats to find the matching monthYear
    for (const stat of data.monthlyAttendanceStats || []) {
      if (stat.monthYear === currentMonth) {
        setMonthlyStats({
          workingDays: stat.workingDays || 0,
          presentDays: stat.presentDays || 0,
          absentDays: stat.absentDays || 0,
          halfDays: stat.halfDays || 0,
          lateDays: stat.lateDays || 0,
          overtimeHours: stat.overtimeHours || 0,
          paidLeaves: monthlyStats.paidLeaves, // leave values will be updated separately
          unpaidLeaves: monthlyStats.unpaidLeaves,
        });
        break; // Stop looping once we find a match
      }
    }
  };

	function getLocalDateStart(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Build a lookup of holidayDate -> holidayTitle
    const holidayLookup = holidays.reduce((map, holiday) => {
      const key = new Date(holiday.date).toISOString().split("T")[0];
      map[key] = holiday.title;       // { "01/01/2025": "New Year" }
      return map;
    }, {});

    const weekOffDays = [0, 6]; // Sunday (0), Saturday (6)

    // Add empty cells for days before first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Create a Set to store absent days (excluding weekends)
    const absentDays = new Set();
    if (Array.isArray(leaveRecords) && leaveRecords.length > 0) {
      leaveRecords.forEach((lr) => {
        const startDate = new Date(lr.startDate);
        const endDate = new Date(lr.endDate);

        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const leaveDay = new Date(d); // Clone to avoid mutation
          const isSameMonth =
            leaveDay.getMonth() === month && leaveDay.getFullYear() === year;
          const isWeekoff = weekOffDays.includes(leaveDay.getDay());

          if (isSameMonth && !isWeekoff) {
            absentDays.add(leaveDay.getDate());
          }
        }
      });
    }
    
    // Loop through each day of the month
    for (let date = 1; date <= lastDay.getDate(); date++) {
      const currentDate = new Date(year, month, date);
      const dayOfWeek = currentDate.getDay();
      const iso = currentDate.toISOString().split("T")[0];

      // Holiday check
      if (holidayLookup[iso]) {
        days.push({
          date,
          status: "holiday",
          title: holidayLookup[iso],
        });
        continue;
      }

      // Weekends check
      if (weekOffDays.includes(dayOfWeek)) {
        days.push({ date, status: "weekend" });
        continue;
      }

      // Leaves check
      if (absentDays.has(date)) {
        days.push({
          date,
          status: "on Leave",
          isLate: false,
          checkIn: "N/A",
          checkOut: "N/A",
        });
        continue;
      }

      // Attendance
      const record = attendanceData.find((att) => {
				const attDate = new Date(att.date);
				return (
					attDate.getFullYear() === currentDate.getFullYear() &&
					attDate.getMonth() === currentDate.getMonth() &&
					attDate.getDate() === currentDate.getDate()
				);
			});

      const today = getLocalDateStart(new Date());
			const recordDate = getLocalDateStart(currentDate); // currentDate is your loop date

      if (record) {
        const status = record.attendanceStatus || "Present";
        days.push({
          date,
          status,
          isLate: record.lateDays > 0,
          checkIn: record.punchInTime
            ? new Date(record.punchInTime).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
          checkOut: record.punchOutTime
            ? new Date(record.punchOutTime).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
        });
      } else {
        const isPastDay = recordDate < today;
        days.push({
          date,
          status: isPastDay ? "" : "",
          isLate: false,
          checkIn: "N/A",
          checkOut: "N/A",
        });
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Returns the appropriate CSS class based on the status
  const getStatusColor = (status, isLate) => {
    if (status === "holiday") return "att-status-holiday";
    if (isLate) return "att-status-late";
    switch (status) {
      case "Present":
        return "att-status-present";
      case "Absent":
        return "att-status-absent";
      case "half-day":
        return "att-status-half-day";
      case "on Leave":
        return "att-status-leave";
      case "unpaid-leave":
        return "att-status-unpaid-leave";
      default:
        return "att-status-default";
    }
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1)
    );
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!employeeData) return <div className="p-4">No employee data found</div>;

  return (
    <div className="att-container">
      {/* Employee Overview */}
      <div className="att-employee-card">
        <div className="att-employee-content">
          <div className="att-employee-avatar">
            <User className="att-avatar-icon" />
          </div>
          <div>
            <h2 className="att-employee-name">{employeeData.name}</h2>
            <div className="att-employee-details">
              <p className="att-employee-id">Employee ID: {employeeData.id}</p>
              <p className="att-employee-title">{employeeData.jobTitle}</p>
              <p className="att-employee-department">
                {employeeData.department}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="att-stats-grid">
        <StatCard
          icon={<Calendar className="att-icon att-icon-indigo" />}
          title="Working Days"
          value={monthlyStats.workingDays.toString()}
          subtitle="This month"
          color="att-bg-indigo"
        />
        <StatCard
          icon={<UserCheck className="att-icon att-icon-green" />}
          title="Present Days"
          value={monthlyStats.presentDays.toString()}
          subtitle="This month"
          color="att-bg-green"
        />
        <StatCard
          icon={<UserX className="att-icon att-icon-red" />}
          title="Absent Days"
          value={monthlyStats.absentDays.toString()}
          subtitle="This month"
          color="att-bg-red"
        />
        <StatCard
          icon={<UserMinus className="att-icon att-icon-orange" />}
          title="Half Days"
          value={monthlyStats.halfDays.toString()}
          subtitle="This month"
          color="att-bg-orange"
        />
      </div>

      <div className="att-stats-grid">
        <StatCard
          icon={<Wallet className="att-icon att-icon-blue" />}
          title="Paid Leaves"
          value={monthlyStats.totalPaidLeaves}
          subtitle="This month"
          color="att-bg-blue"
        />
        <StatCard
          icon={<WalletCards className="att-icon att-icon-purple" />}
          title="Unpaid Leaves"
          value={monthlyStats.totalUnpaidLeaves}
          subtitle="This month"
          color="att-bg-purple"
        />
        <StatCard
          icon={<Clock4 className="att-icon att-icon-yellow" />}
          title="Late Days"
          value={monthlyStats.lateDays.toString()}
          subtitle="This month"
          color="att-bg-yellow"
        />
        <StatCard
          icon={<Timer className="att-icon att-icon-cyan" />}
          title="Overtime Hours"
          value={`${Math.floor(monthlyStats.overtimeHours / (1000 * 60 * 60))}hr 
          ${ Math.floor((monthlyStats.overtimeHours % (1000 * 60 * 60)) / (1000 * 60))}m`}
          subtitle="This month"
          color="att-bg-cyan"
        />
      </div>

      {/* Calendar/List View */}
      <div className="att-view-container">
        <div className="att-view-header">
          <div className="att-month-selector">
            <button onClick={handlePreviousMonth} className="att-nav-button">
              <ChevronLeft className="att-nav-icon" />
            </button>
            <span className="att-current-month">
              {selectedMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={handleNextMonth} className="att-nav-button">
              <ChevronRight className="att-nav-icon" />
            </button>
          </div>
          <div className="att-view-toggle">
            <button
              onClick={() => setViewType("calendar")}
              className={`att-toggle-button ${
                viewType === "calendar" ? "att-toggle-active" : ""
              }`}
            >
              <CalendarDays className="att-toggle-icon" />
              Calendar View
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`att-toggle-button ${
                viewType === "list" ? "att-toggle-active" : ""
              }`}
            >
              <List className="att-toggle-icon" />
              List View
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="att-legend">
          <div className="att-legend-item">
            <div className="att-legend-dot att-dot-present"></div>
            <span className="att-legend-text">Present</span>
          </div>
          <div className="att-legend-item">
            <div className="att-legend-dot att-dot-absent"></div>
            <span className="att-legend-text">Absent</span>
          </div>
          <div className="att-legend-item">
            <div className="att-legend-dot att-dot-half-day"></div>
            <span className="att-legend-text">Half Day</span>
          </div>
          <div className="att-legend-item">
            <div className="att-legend-dot att-dot-late"></div>
            <span className="att-legend-text">Late</span>
          </div>
          <div className="att-legend-item">
            <div className="att-legend-dot att-dot-leave"></div>{" "}
            <span className="att-legend-text">On Leave</span>
          </div>
          <div className="att-legend-item">
            <div className="att-legend-dot att-dot-holiday"></div>{" "}
            <span className="att-legend-text">Holiday</span>
          </div>
        </div>

        {viewType === "calendar" ? (
          <div className="att-calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="att-calendar-header">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`att-calendar-cell ${
                  !day ? "att-calendar-empty" : ""
                }`}
              >
                {day && (
                  <>
                    <div className="att-calendar-cell-header">
                      <span className="att-calendar-date">{day.date}</span>
                      {day.status !== "weekend" && day.status !== "holiday" && (
                        <span
                          className={`att-calendar-status ${getStatusColor(
                            day.status,
                            day.isLate
                          )}`}
                        >
                          {day.isLate
                            ? "Late"
                            : day.status.charAt(0).toUpperCase() +
                              day.status.slice(1).replace("-", " ")}
                        </span>
                      )}
                      {/* Holiday badge */}
                      {day.status === "holiday" && (
                        <span className="att-calendar-status att-status-holiday">
                          {day.title}
                        </span>
                      )}
                    </div>
                    {day.status !== "weekend" && day.status !== "holiday" && (
                      <div className="att-calendar-time">
                        <p className="att-time-entry">In: {day.checkIn}</p>
                        {day.checkOut !== "N/A" && (
                          <p className="att-time-entry">Out: {day.checkOut}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="att-table-container">
            <table className="att-table">
              <thead>
                <tr>
                  <th className="att-table-header">Date</th>
                  <th className="att-table-header">Status</th>
                  <th className="att-table-header">Check In</th>
                  <th className="att-table-header">Check Out</th>
                </tr>
              </thead>
              <tbody>
                {calendarDays
                  .filter((day) => day !== null && day.status !== "weekend")
                  .map((day, index) => (
                    <tr key={index}>
                      <td className="att-table-cell">
                        {selectedMonth.toLocaleString("default", {
                          month: "short",
                        })}{" "}
                        {day.date}
                      </td>
                      <td className="att-table-cell">
                        <span
                          className={`att-table-status ${getStatusColor(
                            day.status,
                            day.isLate
                          )}`}
                        >
                          {day.isLate
                            ? "Late"
                            : day.status.charAt(0).toUpperCase() +
                              day.status.slice(1).replace("-", " ")}
                        </span>
                      </td>
                      <td className="att-table-cell">{day.checkIn}</td>
                      <td className="att-table-cell">{day.checkOut}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
