import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./AttendanceTracker.css";
const API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;

export default function AttendanceTracker() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
	const [requestType, setRequestType] = useState("punchIn");
  const [showModal, setShowModal] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [punchInTime, setPunchInTime] = useState("");
	const [punchOutTime, setPunchOutTime] = useState("");
	const [reason, setReason] = useState("");
  
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);

    const employeeId = localStorage.getItem("userId"); // Get employeeId from local storage
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1; // Month is zero-based in JS, so add 1
    try {
      const response = await fetch(
        `${API_BASE_URL_AT}/api/attendance/${employeeId}?year=${year}&month=${month}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const formatWorkingHours = (minutes) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  };

  // Function to handle opening the modal
	const handleAttendanceRequest = () => {
		setShowModal(true);
		// Reset form values
		setRequestType("punchIn"); // Default to punch in
		setPunchInTime("");
		setPunchOutTime("");
		setReason("");
		setSelectedDate(new Date());
	};

	// Function to close the modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Create date object from selected date and time strings
		const date = selectedDate.toLocaleString();
		const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD

		// Only one of punchInTime or punchOutTime should be provided based on your service requirement
		const requestData = {
			date: date,
			punchInTime:
				requestType === "punchIn"
					? `${formattedDate}T${punchInTime}:00`
					: null,
			punchOutTime:
				requestType === "punchOut"
					? `${formattedDate}T${punchOutTime}:00`
					: null,
			reason: reason,
		};

		submitAttendanceRequest(requestData);
		setShowModal(false);
	};

	const submitAttendanceRequest = async (requestData) => {
		setIsSubmitting(true);
		try {
			const employeeId = localStorage.getItem("id");
			const response = await fetch(
				`${API_BASE_URL_AT}/api/attendanceRequest`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						employeeId: employeeId,
						requestDate: new Date(),
						attendanceDate: requestData.date,
						punchInTime: requestData.punchInTime
							? requestData.punchInTime
							: null,
						punchOutTime: requestData.punchOutTime
							? requestData.punchOutTime
							: null,
						reason: requestData.reason,
					}),
				}
			);

			if (!response.ok) {
				console.error("Failed to submit attendance request");
			} else {
				alert("Attendance request submitted successfully!");
			}

			// Show success message or refresh data
			fetchAttendanceData(); // Refresh the attendance data
		} catch (error) {
			setError(error.message);
			alert(`Error: ${error.message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatDate = (dateString) => {
		const date = String(new Date(dateString).getDate()).padStart(2, "0");
		const month = String(new Date(dateString).getMonth() + 1).padStart(2, "0");
		const year = new Date(dateString).getFullYear();
		return `${date}-${month}-${year}`;
	};

  return (
    <div className="attendance-tracker-container">
      <div className="attendance-tracker-header">
        <div className="attendance-tracker-nav">
          <button
            onClick={handlePreviousMonth}
            className="attendance-tracker-nav-btn"
          >
            <ChevronLeft className="attendance-tracker-icon" />
          </button>
          <span className="attendance-tracker-month">
            {selectedMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={handleNextMonth}
            className="attendance-tracker-nav-btn"
          >
            <ChevronRight className="attendance-tracker-icon" />
          </button>
        </div>
        {/* This is the button that opens the modal */}
				<div className="attendance-request">
					<button
						className="attendance-request-button"
						onClick={handleAttendanceRequest}
					>
						Attendance Request
					</button>
				</div>
      </div>

      <div className="attendance-tracker-table-wrapper">
        {loading ? (
          <p>Loading attendance records...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="attendance-tracker-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Overtime</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{formatDate(new Date(record.date))}</td>
                  <td>{record.attendanceStatus}</td>
                  <td>
                    {record.punchInTime
                      ? new Date(record.punchInTime).toLocaleTimeString()
                      : "-"}
                  </td>{" "}
                  <td>
                    {record.punchOutTime
                      ? new Date(record.punchOutTime).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td>{record.workingHours}</td>
                  <td>{record.overtime ? record.overtime : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Attendance Request Modal */}
			{showModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<div className="modal-header">
							<div className="employee-info">
								<h3>Attendance Request</h3>
							</div>
							<button
								className="close-btn"
								onClick={handleCloseModal}
							>
								✕
							</button>
						</div>

						<form onSubmit={handleSubmit}>
							<div className="date-selector">
								<label>
									Date:{" "}
									{formatDate(new Date())}
								</label>
								<input
									type="date"
									value={selectedDate
										.toISOString()
										.slice(0, 10)}
									onChange={(e) =>
										setSelectedDate(
											new Date(e.target.value)
										)
									}
								/>
							</div>

							<div className="request-type-selector">
								<label>Request Type:</label>
								<div className="radio-group">
									<label>
										<input
											type="radio"
											name="requestType"
											value="punchIn"
											checked={requestType === "punchIn"}
											onChange={() =>
												setRequestType("punchIn")
											}
										/>
										Punch In
									</label>
									<label>
										<input
											type="radio"
											name="requestType"
											value="punchOut"
											checked={requestType === "punchOut"}
											onChange={() =>
												setRequestType("punchOut")
											}
										/>
										Punch Out
									</label>
								</div>
							</div>

							<div className="time-inputs">
								{requestType === "punchIn" && (
									<div className="input-group">
										<label>Punch In Time</label>
										<input
											type="time"
											value={punchInTime}
											onChange={(e) =>
												setPunchInTime(e.target.value)
											}
											required
										/>
									</div>
								)}

								{requestType === "punchOut" && (
									<div className="input-group">
										<label>Punch Out Time</label>
										<input
											type="time"
											value={punchOutTime}
											onChange={(e) =>
												setPunchOutTime(e.target.value)
											}
											required
										/>
									</div>
								)}
							</div>

							<div className="reason-input">
								<label>Reason</label>
								<textarea
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									placeholder="Message"
									required
								/>
							</div>
							<div className="modal-footer">
								<button
									type="submit"
									className="submit-btn"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Submitting..." : "Submit"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
    </div>
  );
}
