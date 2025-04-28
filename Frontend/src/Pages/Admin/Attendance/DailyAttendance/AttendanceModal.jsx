import React, { useState } from "react";
import "./AttendanceModal.css";

const AttendanceModal = ({ employee, onClose, onSubmit }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    // Initialize with employee's existing punch times if available
    const todayAttendance = employee.attendance?.find(
        (att) => new Date(att.date).toDateString() === today.toDateString()
    );

    const [punchInTime, setPunchInTime] = useState(
        todayAttendance?.punchInTime
            ? new Date(todayAttendance.punchInTime).toLocaleTimeString(
                  "en-US",
                  { hour12: false, hour: "2-digit", minute: "2-digit" }
              )
            : ""
    );

    const [punchOutTime, setPunchOutTime] = useState(
        todayAttendance?.punchOutTime
            ? new Date(todayAttendance.punchOutTime).toLocaleTimeString(
                  "en-US",
                  { hour12: false, hour: "2-digit", minute: "2-digit" }
              )
            : ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert time strings to Date objects
        const punchIn = punchInTime
            ? new Date(`${today.toDateString()} ${punchInTime}`)
            : null;
        const punchOut = punchOutTime
            ? new Date(`${today.toDateString()} ${punchOutTime}`)
            : null;

        onSubmit({
            employeeId: employee.id,
            punchInTime: punchIn,
            punchOutTime: punchOut,
			attendanceStatus: "Present",
            date: today,
        });

        onClose();
    };

    return (
        <div className="attendance-modal-backdrop">
            <div className="attendance-modal">
                <div className="attendance-modal-header">
                    <h3>Employee Daily Attendance</h3>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="attendance-modal-content">
                    <div className="employee-info1">
                        <p>
                            <strong>Date:</strong> {formattedDate}
                        </p>
                        <p>
                            <strong>Employee:</strong> {employee.name}
                        </p>
                        <p>
                            <strong>Staff Timing:</strong>{" "}
                            {employee.shiftStartTime || "10:30 AM"} -{" "}
                            {employee.shiftEndTime || "8:00 PM"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="punchInTime">Punch-In Time</label>
                            <input
                                type="time"
                                id="punchInTime"
                                value={punchInTime}
                                onChange={(e) => setPunchInTime(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="punchOutTime">Punch-Out Time</label>
                            <input
                                type="time"
                                id="punchOutTime"
                                value={punchOutTime}
                                onChange={(e) =>
                                    setPunchOutTime(e.target.value)
                                }
                            />
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="submit-button">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;
