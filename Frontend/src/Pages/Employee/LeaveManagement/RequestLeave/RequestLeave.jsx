import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import "./RequestLeave.css";
const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
const API_BASE_URL_NS = import.meta.env.VITE_API_BASE_URL_NS;



export default function Leave() {
  // Form states
  const [leaveType, setLeaveType] = useState("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [leaveDuration, setLeaveDuration] = useState("FULL_DAY");

  // Data states
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch the employee ID from localStorage
    const id = localStorage.getItem("userId");
    const namee=localStorage.getItem("name");
    if(namee)
    {
      setName(namee);
    }
    if (id) {
      setEmployeeId(id);
      fetchLeaveBalance(id);
      fetchRecentRequests(id);
    } else {
      setError("Employee ID not found in local storage");
    }
  }, []);

  const fetchLeaveBalance = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-balance?employeeId=${id}`,{
          method:"GET",
          headers:{
            "Content-type":"application/json"
          }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch leave balance");
      const data = await response.json();
      setLeaveBalance(data);
    } catch (err) {
      setError("Error fetching leave balance");
      console.error(err);
    }
  };

  const fetchRecentRequests = async (id) => {
    try {
      // Using backend filtering to get only the requests for the specified employee
      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-requests?employeeId=${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch recent requests");
      const data = await response.json();
      // Sort the requests by appliedOn date in descending order (most recent first)
      const sortedData = data.sort(
        (a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)
      );
      // Limit to top 3 recent requests if needed
      setRecentRequests(sortedData.slice(0, 3));
    } catch (err) {
      setError("Error fetching recent requests");
      console.error(err);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {

       // Validate HALF_DAY duration dates
    if (
      leaveDuration === "HALF_DAY" &&
      new Date(startDate).toDateString() !== new Date(endDate).toDateString()
    ) {
      throw new Error("For HALF_DAY leave, start and end dates must be the same.");
    }
      // Prepare leave request data with employeeId from localStorage
      const leaveRequestData = {
        employeeId, // This value comes directly from local storage
        leaveType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason,
        leaveDuration,
        status: "PENDING",
      };

      // Upload file if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const fileResponse = await fetch(
          `${API_BASE_URL_LM}/api/upload-leave-request-docs`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!fileResponse.ok) throw new Error("Failed to upload file");
        const fileData = await fileResponse.json();
        leaveRequestData.supportingDocs = fileData.url;
      }

      // Submit the leave request
      const response = await fetch(`${API_BASE_URL_LM}/api/leave-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveRequestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit leave request");
      }

      // Extract the newly created leave request
      const leaveRequest = await response.json();
      let data;
      try {
        const response = await fetch(
          `${API_BASE_URL_LM}/api/employees/${employeeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employee details");
        }
        data = await response.json();
        setManagerId(data.employmentDetails.lineManagerId);
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to load employee details");
      }

      if (!data?.employmentDetails?.lineManagerId) throw new Error("Line manager not found for employee",data.employmentDetails);

      // Send notification to the line manager
      const notificationResponse = await fetch(
        `${API_BASE_URL_NS}/api/notifications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userIds: [data.employmentDetails.lineManagerId], // Send notification to the line manager
            type: "AUTO", // Auto-generated notification
            title: "New Leave Request Submitted",
            message: `Employee ${name} has submitted a leave request from ${leaveRequestData.startDate.split('T')[0]} to ${leaveRequestData.endDate.split('T')[0]}.`,
            priority: "NORMAL",
          }),
        }
      );
      setManagerId("");
      if (!notificationResponse.ok)
        throw new Error("Failed to send notification");

      // Reset form fields after successful submission
      setStartDate("");
      setEndDate("");
      setReason("");
      setSelectedFile(null);
      setSuccessMessage("Leave request submitted successfully!");

      // Refresh recent requests and leave balance
      fetchRecentRequests(employeeId);
      fetchLeaveBalance(employeeId);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format status text
  const formatStatus = (status) => {
    if (status === "On_Hold") {
      return "On Hold";
    }
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="leave-management-container">
      <header className="header">
        <h1 className="header-title">Leave Management</h1>
        <p className="header-subtitle">Request and manage your leaves</p>
      </header>

      <div className="form-and-summary">
        <div className="leave-form-container">
          <div className="leave-request-form">
            <h2 className="section-title">Request Leave</h2>
            <form className="leave-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="COMPENSATORY">Compensatory Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Duration Type</label>
                <select
                  value={leaveDuration}
                  onChange={(e) => setLeaveDuration(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="FULL_DAY">Full Day</option>
                  <option value="HALF_DAY">Half Day</option>
                </select>
              </div>

              <div className="date-picker-container">
                <div className="form-group">
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Reason</label>
                <textarea
                  rows={4}
                  className="input-field"
                  placeholder="Please provide a reason for your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Supporting Documents</label>
                <div className="file-upload-container">
                  <Upload className="upload-icon" />
                  <div className="upload-text">
                    <label htmlFor="file-upload" className="upload-label">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <p className="file-upload-info">
                    PDF, DOC, DOCX, JPG up to 10MB
                  </p>
                  {selectedFile && (
                    <p className="file-name">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>

        <div className="leave-summary-container">
          <div className="leave-balance">
            <h2 className="section-title">Leave Balance</h2>
            <div className="leave-item">
              <p className="leave-type">Casual Leave Balance</p>
              <p className="leave-detail">
                {leaveBalance.casualBalance} days remaining
              </p>
            </div>
            <div className="leave-item">
              <p className="leave-type">Sick Leave Balance</p>
              <p className="leave-detail">
                {leaveBalance.sickBalance} days remaining
              </p>
            </div>
            <div className="leave-item">
              <p className="leave-type">Total Compensatory Leave Balance</p>
              <p className="leave-detail">
                {leaveBalance.compensatoryBalance} days
              </p>
              
            </div>
            <div className="leave-item">
              <p className="leave-type">Total Overtime Hours </p>
              <p className="leave-detail">
                {leaveBalance.remainingOvertimeInHours} hr
              </p>
              
            </div>
          </div>

          <div className="recent-requests">
            <h2 className="section-title">Recent Requests</h2>
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <div key={request.id} className="request-item">
                  <div>
                    <p className="request-type">{request.leaveType}</p>
                    <p className="request-dates">
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status ${request.status.toLowerCase()}`}>
                    {formatStatus(request.status)}
                  </span>
                </div>
              ))
            ) : (
              <p>No recent leave requests</p>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
}
