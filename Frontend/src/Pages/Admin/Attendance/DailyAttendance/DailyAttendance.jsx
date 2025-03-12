import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./DailyAttendance.css";

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

    // Set today's date parameters for fetching leave records
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const currentDay = today.getDate();

    // API base URLs for different services
    const ATTENDANCE_API_BASE_URL = "http://localhost:5003/api";
    const LEAVE_API_BASE_URL = "http://localhost:5005/api";

    // Fetch employees when component mounts
    useEffect(() => {
        fetchEmployees();
    }, []);

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
                        recordDate.getDate() === currentDay &&
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
            const response = await fetch(
                `${ATTENDANCE_API_BASE_URL}/employees`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch employee data");
            }
            const data = await response.json();
            console.log("Employee data:-",data)
            if(!data.message)setEmployees(data);
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

    // Modified filtering logic to only show employees who have marked attendance
    const filteredEmployees = employees?.filter((employee) => {
        // Check if the employee has a leave record for today
        const hasLeaveRecord = todayLeaveRecords.some(
            (record) => record.employeeId === employee.id
        );

        // Check if employee has marked attendance for today
        const hasTodayAttendance = employee.attendance && 
            employee.attendance.length > 0 && 
            employee.attendance[0].date && 
            new Date(employee.attendance[0].date).toDateString() === today.toDateString();

        // Determine the effective status
        const status = hasLeaveRecord 
            ? "Absent" 
            : (hasTodayAttendance && employee.attendance[0].attendanceStatus) 
                ? employee.attendance[0].attendanceStatus 
                : null;

        // Only return employees who have marked attendance or have a leave record
        if (!status) return false;

        const statusMatch = !filters.status || status === filters.status;
        return (
            (!filters.location || employee.location === filters.location) &&
            (!filters.department || employee.department === filters.department) &&
            statusMatch
        );
    });

    // Compute summary counts with updated logic
    const attendanceCounts = {
        present: filteredEmployees.filter(
            (emp) => emp.attendance && 
                     emp.attendance.length > 0 && 
                     new Date(emp.attendance[0].date).toDateString() === today.toDateString() &&
                     emp.attendance[0].attendanceStatus === "Present"
        ).length,
        absent: filteredEmployees.filter(
            (emp) => todayLeaveRecords.some(
                (record) => record.employeeId === emp.id
            ) || 
            (emp.attendance && 
             emp.attendance.length > 0 && 
             new Date(emp.attendance[0].date).toDateString() === today.toDateString() &&
             emp.attendance[0].attendanceStatus === "Absent")
        ).length,
        halfDay: filteredEmployees.filter(
            (emp) => emp.attendance && 
                     emp.attendance.length > 0 && 
                     new Date(emp.attendance[0].date).toDateString() === today.toDateString() &&
                     emp.attendance[0].attendanceStatus === "Half Day"
        ).length,
        onLeave: filteredEmployees.filter(
            (emp) => todayLeaveRecords.some(
                (record) => record.employeeId === emp.id
            )
        ).length
    };

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
                                // Check if employee has a leave record for today
                                const hasLeaveRecord = todayLeaveRecords.some(
                                    (record) => record.employeeId === employee.id
                                );

                                // Determine status
                                const status = hasLeaveRecord 
                                    ? "Absent" 
                                    : (employee.attendance && 
                                       employee.attendance.length && 
                                       new Date(employee.attendance[0].date).toDateString() === today.toDateString() &&
                                       employee.attendance[0].attendanceStatus)
                                        ? employee.attendance[0].attendanceStatus 
                                        : "-";

                                return (
                                    <tr
                                        key={employee.id}
                                        onClick={() => {
                                            setSelectedEmployee(employee);
                                            setShowAttendanceModal(true);
                                        }}
                                    >
                                        <td>{employee.name}</td>
                                        <td>{employee.department || "-"}</td>
                                        <td>{employee.location || "-"}</td>
                                        <td>{status}</td>
                                        <td>
                                            {employee.attendance &&
                                            employee.attendance.length &&
                                            new Date(employee.attendance[0].date).toDateString() === today.toDateString() &&
                                            employee.attendance[0].punchInTime
                                                ? new Date(
                                                      employee.attendance[0].punchInTime
                                                  ).toLocaleTimeString()
                                                : "-"}
                                        </td>
                                        <td>
                                            {employee.attendance &&
                                            employee.attendance.length &&
                                            new Date(employee.attendance[0].date).toDateString() === today.toDateString() &&
                                            employee.attendance[0].punchOutTime
                                                ? new Date(
                                                      employee.attendance[0].punchOutTime
                                                  ).toLocaleTimeString()
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
                    <p>No attendance records for today. Employees need to mark their attendance.</p>
                </div>
            )}

            {showAttendanceModal && <AttendanceModal />}
        </div>
    );
};

export default DailyAttendance;