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

// API base URLs for different services
const ATTENDANCE_API_BASE_URL = 'http://localhost:5003/api';
const LEAVE_API_BASE_URL = 'http://localhost:5005/api';

const employeeId = localStorage.getItem("signedUserId");
console.log("From attendence dashboard:-",employeeId);
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
    const [monthlyAttendance, setMonthlyAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New states for leave management:
    // leaveRecords stores detailed leave records (for marking individual days)
    // leaveData stores aggregated totals for the StatCards.
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [leaveData, setLeaveData] = useState({ paidLeaves: 0, unpaidLeaves: 0 });

    // Fetch employee data from attendance backend
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(`${ATTENDANCE_API_BASE_URL}/employees/${employeeId}`);
                if (!response.ok) throw new Error('Failed to fetch employee data');
                const data = await response.json();
                setEmployeeData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEmployeeData();
    }, []);

    // Fetch monthly attendance data for the specific employee
    useEffect(() => {
        const fetchMonthlyAttendance = async () => {
            try {
                const monthYear = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
                const response = await fetch(`${ATTENDANCE_API_BASE_URL}/attendance/employee/${employeeId}/monthly/${monthYear}`);
                if (!response.ok) throw new Error('Failed to fetch attendance data');
                const data = await response.json();
                setMonthlyAttendance(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyAttendance();
    }, [selectedMonth]);

    // New effect: Fetch detailed leave records from the leave management backend (PORT 5005)
    useEffect(() => {
        const fetchMonthlyLeaveData = async () => {
            try {
                const year = selectedMonth.getFullYear();
                const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
                const response = await fetch(
                    `${LEAVE_API_BASE_URL}/leave-history/employee/${employeeId}/${year}/${month}`
                );
                if (!response.ok) throw new Error('Failed to fetch leave data');
                const data = await response.json();
                // Store detailed leave records for per-day check
                setLeaveRecords(data);
                
                // Calculate aggregated totals for paid and unpaid leaves for StatCards
                let totalPaidLeaves = 0;
                let totalUnpaidLeaves = 0;
                data.forEach(record => {
                    totalPaidLeaves += record.paidLeave || 0;
                    totalUnpaidLeaves += record.unpaidLeave || 0;
                });
                setLeaveData({ paidLeaves: totalPaidLeaves, unpaidLeaves: totalUnpaidLeaves });
            } catch (err) {
                console.error(err);
            }
        };

        fetchMonthlyLeaveData();
    }, [selectedMonth]);

    // Calculate monthly statistics from attendance data
    const calculateMonthlyStats = () => {
        const stats = {
            workingDays: 22, // Default working days (can be adjusted)
            presentDays: 0,
            absentDays: 0,
            halfDays: 0,
            lateDays: 0,
            overtimeHours: 0
        };

        let totalOvertimeMinutes = 0;
        monthlyAttendance.forEach(record => {
            // Count as present if there's a punchInTime
            if (record.punchInTime) {
                if (
                    record.attendanceStatus &&
                    record.attendanceStatus.toUpperCase() === 'HALF DAY'
                ) {
                    stats.halfDays++;
                } else {
                    stats.presentDays++;
                }
            }
            // Late if punchInTime exists and lateComing > 0
            if (record.punchInTime && record.lateComing && record.lateComing > 0) {
                stats.lateDays++;
            }
            // Sum overtime minutes for all records
            if (record.overtime) {
                totalOvertimeMinutes += record.overtime;
            }
        });

        stats.overtimeHours = Math.floor(totalOvertimeMinutes / 60);
        // Integrate leave management data for absent days calculation
        stats.absentDays = leaveData.paidLeaves + leaveData.unpaidLeaves;
        return stats;
    };

    // Merge leave data into monthlyStats for StatCards
    const monthlyStats = { 
        ...calculateMonthlyStats(), 
        paidLeaves: leaveData.paidLeaves, 
        unpaidLeaves: leaveData.unpaidLeaves 
    };

    // Generate calendar days with attendance data and mark leave days as "Absent"
    const generateCalendarDays = () => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        for (let date = 1; date <= lastDay.getDate(); date++) {
            const currentDate = new Date(year, month, date);
            const dayOfWeek = currentDate.getDay();

            // Mark weekends as weekend
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                days.push({ date, status: "weekend" });
                continue;
            }

            // Check if there's a leave record for this day.
            // (Assuming the leave record's "appliedOn" field indicates the leave date.)
            const leaveRecord = leaveRecords.find(lr => {
                const lrDate = new Date(lr.appliedOn);
                return (
                    lrDate.getDate() === date &&
                    lrDate.getMonth() === month &&
                    lrDate.getFullYear() === year
                );
            });
            if (leaveRecord) {
                // If a leave record exists, mark the day as "Absent"
                days.push({
                    date,
                    status: "absent",
                    isLate: false,
                    checkIn: "N/A",
                    checkOut: "N/A"
                });
                continue;
            }

            // Otherwise, check for attendance records
            const record = monthlyAttendance.find(att => {
                const attDate = new Date(att.date);
                return attDate.getDate() === date;
            });

            if (record) {
                const status = record.paidLeave ? "paid-leave" : 
                               record.unpaidLeave ? "unpaid-leave" : 
                               record.attendanceStatus.toLowerCase();

                days.push({
                    date,
                    status,
                    isLate: record.lateComing > 0,
                    checkIn: record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
                    checkOut: record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"
                });
            } else {
                days.push({
                    date,
                    status: "",
                    isLate: false,
                    checkIn: "N/A",
                    checkOut: "N/A"
                });
            }
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    // Returns the appropriate CSS class based on the status
    const getStatusColor = (status, isLate) => {
        if (isLate) return "att-status-late";
        switch (status) {
            case "present":
                return "att-status-present";
            case "absent":
                return "att-status-absent";
            case "half-day":
                return "att-status-half-day";
            case "paid-leave":
                return "att-status-paid-leave";
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
                    value={monthlyStats.paidLeaves.toString()}
                    subtitle="This month"
                    color="att-bg-blue"
                />
                <StatCard
                    icon={<WalletCards className="att-icon att-icon-purple" />}
                    title="Unpaid Leaves"
                    value={monthlyStats.unpaidLeaves.toString()}
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
                    value={`${monthlyStats.overtimeHours}h`}
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
                            className={`att-toggle-button ${viewType === "calendar" ? "att-toggle-active" : ""}`}
                        >
                            <CalendarDays className="att-toggle-icon" />
                            Calendar View
                        </button>
                        <button
                            onClick={() => setViewType("list")}
                            className={`att-toggle-button ${viewType === "list" ? "att-toggle-active" : ""}`}
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
                        <div className="att-legend-dot att-dot-paid-leave"></div>
                        <span className="att-legend-text">Paid Leave</span>
                    </div>
                    <div className="att-legend-item">
                        <div className="att-legend-dot att-dot-unpaid-leave"></div>
                        <span className="att-legend-text">Unpaid Leave</span>
                    </div>
                </div>

                {viewType === "calendar" ? (
                    <div className="att-calendar-grid">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="att-calendar-header">
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((day, index) => (
                            <div key={index} className={`att-calendar-cell ${!day ? "att-calendar-empty" : ""}`}>
                                {day && (
                                    <>
                                        <div className="att-calendar-cell-header">
                                            <span className="att-calendar-date">{day.date}</span>
                                            {day.status !== "weekend" && (
                                                <span className={`att-calendar-status ${getStatusColor(day.status, day.isLate)}`}>
                                                    {day.isLate ? "Late" : day.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            )}
                                        </div>
                                        {day.status !== "weekend" && day.checkIn && (
                                            <div className="att-calendar-time">
                                                <p className="att-time-entry">In: {day.checkIn}</p>
                                                {day.checkOut && (
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
                                {calendarDays.filter(day => day !== null && day.status !== "weekend").map((day, index) => (
                                    <tr key={index}>
                                        <td className="att-table-cell">
                                            {selectedMonth.toLocaleString("default", { month: "short" })} {day.date}
                                        </td>
                                        <td className="att-table-cell">
                                            <span className={`att-table-status ${getStatusColor(day.status, day.isLate)}`}>
                                                {day.isLate ? "Late" : day.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
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
