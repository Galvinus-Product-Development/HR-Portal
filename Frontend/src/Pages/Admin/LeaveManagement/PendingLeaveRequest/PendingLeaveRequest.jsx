import React, { useState, useEffect } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  User,
  PauseCircle,
  Edit,
} from "lucide-react";
import "./PendingLeaveRequest.css";

const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
export default function PendingLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isDecisionTaken, setIsDecisionTaken] = useState(false);
  const [employeeMap, setEmployeeMap] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [isCancelStatusModalOpen, setIsCancelStatusModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [holidays, setHolidays] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL_LM}/api/employees`);
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();

      // Create a mapping from employeeId to employee details
      const empMap = data?.map((emp) => ({
        employeeId: emp.id,
        name: emp.name,
      }));

      // Extract all leaveRequests from employees
      const allLeaveRequests = data.flatMap((emp) => emp.leaveRequests || []);
      console.log("All leave requests", allLeaveRequests);

      // Map leave requests and assign employee names correctly
      const leaveRequestsWithNames = allLeaveRequests.map((emp) => ({
        id: emp.id,
        name:
          empMap.find((employee) => employee.employeeId === emp.employeeId)
            ?.name || "N/A", // ✅ Get correct name
        employeeId: emp.employeeId,
        status: emp.status,
        leaveType: emp.leaveType,
        startDate: emp.startDate,
        endDate: emp.endDate,
        appliedOn: emp.appliedOn,
        editStatus: emp.editStatus,
        startDateTemp: emp.startDateTemp,
        endDateTemp: emp.endDateTemp,
        reasonTemp: emp.reasonTemp,
        reason: emp.reason,
        supportingDocs: emp.supportingDocs,
        decisionAt: emp.decisionAt,
      }));

      // ✅ Set the entire leaveRequests array in state at once
      setLeaveRequests(leaveRequestsWithNames);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleFinalDecision = async (id, decision) => {
    let statusToUpdate = decision;
    if (decision === "onHold") {
      statusToUpdate = "ON_HOLD";
    } else if (decision === "approved") {
      statusToUpdate = "APPROVED";
    } else if (decision === "rejected") {
      statusToUpdate = "REJECTED";
    }
    try {
      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-requests/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: statusToUpdate }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update leave request to ${statusToUpdate}`);
      } else {
        setIsDecisionTaken((prev) => !prev);
      }
      // Close both modals after update
      setIsDetailsModalOpen(false);
      setIsEditStatusModalOpen(false);
      setIsCancelStatusModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEditFinalDecision = async (data, decision) => {
    console.log("inside handle edit final decision", data);

    console.log("inside handle edit final decision", decision);
    let statusToUpdate = decision;
    if (decision === "onHold") {
      statusToUpdate = "ON_HOLD";
    } else if (decision === "approved") {
      statusToUpdate = "APPROVED";
    } else if (decision === "rejected") {
      statusToUpdate = "REJECTED";
    }
    try {
      console.log("kjdfcbkasbcabc", data.id);
      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-requests/request-approve/${data.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            editStatus: data.editStatus,
            startDateTemp: data.startDateTemp,
            endDateTemp: data.endDateTemp,
            reasonTemp: data.reasonTemp,
            actionStatus: decision,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update leave request to ${statusToUpdate}`);
      } else {
        setIsDecisionTaken((prev) => !prev);
      }

      const data2 = await response.json();
      console.log(data2);
      // Close both modals after update
      setIsDetailsModalOpen(false);
      setIsEditStatusModalOpen(false);
      setIsCancelStatusModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Helper to format the status string as needed for display
  const formatStatus = (status) => {
    if (status === "On_Hold") {
      return "On Hold";
    }
    return status;
  };

  // Updated getStatusColor function returns the correct CSS class names defined in PendingLeaveRequest.css
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "leave-status-approved";
      case "Rejected":
        return "leave-status-rejected";
      case "Pending":
        return "leave-status-pending";
      case "On_Hold": // Also handle lower case with underscore
        return "leave-status-onHold";
      default:
        return "leave-status-default";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Fetching holiday lists
  useEffect(() => {
    try {
      const fetchHolidays = async () => {
        const response = await fetch(`${API_BASE_URL_LM}/api/holiday/`);

        if (!response.ok) {
          console.error("Unable to fetch holidays");
        }

        const data = await response.json();
        setHolidays(data);
      };

      fetchHolidays();
    } catch (error) {
      console.error("Internal server error", error);
    }
  }, []);

  // after your useEffect that fetches `holidays`
  const weekOffDays = [0, 6]; // Sunday (0) & Saturday (6)
  const holidayDates = holidays.map(
    (holiday) => new Date(holiday.date).toISOString().slice(0, 10) // "YYYY‑MM‑DD"
  );

  // Calculate number of days between two dates (inclusive)
  const calculateDays = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    let count = 0;

    // Iterate from start → end (inclusive)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const iso = d.toISOString().slice(0, 10);

      const isWeekOff = weekOffDays.includes(dayOfWeek);
      const isHoliday = holidayDates.includes(iso);

      if (!isWeekOff && !isHoliday) {
        count++; // Only increment if not a weekend and not a holiday
      }
    }

    return count;
  };

  // Fetch both leave requests and employee data on component mount
  useEffect(() => {
    fetchEmployees();
  }, [isDecisionTaken]);

  console.log("Leave requestsssss", leaveRequests);

  return (
    <div className="leave-container">
      <div className="leave-header">
        <div>
          <h1 className="leave-title">Pending Leave Requests</h1>
          <p className="leave-subtitle">
            Manage and process employee leave requests
          </p>
        </div>
      </div>

      <div className="leave-filters">
        <input
          type="text"
          placeholder="Search by Employee Name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="leave-search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="leave-select-filter"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="On_Hold">On Hold</option>
        </select>
      </div>

      <div className="leave-table-container">
        <table className="leave-table">
          <thead className="leave-table-head">
            <tr>
              <th className="leave-table-header">Employee</th>
              <th className="leave-table-header">Leave Type</th>
              <th className="leave-table-header">Duration</th>
              <th className="leave-table-header">Status</th>
              <th className="leave-table-header">Applied On</th>
              <th className="leave-table-header">Edit Status</th>
              <th className="leave-table-header leave-text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="leave-table-body">
            {leaveRequests
              .filter((request) => {
                const query = searchQuery.toLowerCase();
                return (
                  request?.name?.toLowerCase().includes(query) ||
                  request.employeeId?.toLowerCase().includes(query)
                );
              })
              .filter((request) => {
                if (filterStatus === "All") return true;
                return request.status === filterStatus;
              })
              .filter((request) => {
                const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD
                const decisionDate = request.decisionAt
                  ? new Date(request.decisionAt).toISOString().split("T")[0]
                  : null;

                return (
                  request.decisionAt == null ||
                  decisionDate === today ||
                  (request.editStatus === "EDITED" &&
                    decisionDate === today )||
                  (request.editStatus === "CANCELED"  &&
                    decisionDate === today )
                );
              }).sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn))
              .map((request) => (
                <tr key={request.id} className="leave-table-row">
                  <td className="leave-table-cell">
                    <div className="leave-employee-info">
                      <div className="leave-employee-avatar">
                        <User className="leave-avatar-icon" />
                      </div>
                      <div className="leave-employee-details">
                        <div className="leave-employee-name">
                          {request.name || "N/A"}
                        </div>
                        <div className="leave-employee-id">
                          {request.employeeId || "N/A"}{" "}
                          {employeeMap[request.employeeId]?.jobTitle
                            ? ` - ${employeeMap[request.employeeId].jobTitle}`
                            : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="leave-table-cell">{request.leaveType}</td>
                  <td className="leave-table-cell">
                    <div>
                      {formatDate(request.startDate)} -{" "}
                      {formatDate(request.endDate)}
                    </div>
                    <div>
                      {calculateDays(request.startDate, request.endDate)} days
                    </div>
                  </td>
                  <td className="leave-table-cell">
                    <span
                      className={`status-badge ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status === "On_Hold"
                        ? "On Hold"
                        : request.status}
                    </span>
                  </td>
                  <td className="leave-table-cell">
                    {formatDate(request.appliedOn)}
                  </td>
                  <td className="leave-table-cell">
                    {request.editStatus === "EDITED" && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsEditStatusModalOpen(true);
                        }}
                        className="leave-edit-button"
                      >
                        <Edit className="leave-icon" /> Edited
                      </button>
                    )}
                    {request.editStatus === "CANCELLED" && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsCancelStatusModalOpen(true);
                        }}
                        className="leave-cancelled-button"
                      >
                        Cancelled
                      </button>
                    )}
                    {(request.editStatus === null ||
                      request.editStatus === "NULL") && <span>--</span>}

                    {/* <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsEditStatusModalOpen(true);
                      }}
                      className="leave-edit-button"
                    >
                      <Edit className="leave-icon" /> Edit
                    </button> */}
                  </td>
                  <td className="leave-table-cell leave-text-right">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsDetailsModalOpen(true);
                      }}
                      className="leave-details-button"
                    >
                      <Eye className="leave-icon" /> View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="leave-modal-overlay">
          <div className="leave-modal">
            <div className="leave-modal-header">
              <h2 className="leave-modal-title">Leave Request Details</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="leave-close-button"
              >
                <XCircle className="leave-close-icon" />
              </button>
            </div>
            <p className="leave-modal-request-id">
              Request ID: {selectedRequest.id}
            </p>
            <div className="leave-modal-body">
              <p>
                <strong>Employee Name:</strong> {selectedRequest.name || "N/A"}
              </p>
              <p>
                <strong>Leave Type:</strong> {selectedRequest.leaveType}
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.reason}
              </p>
              <p>
                <strong>Leave Dates:</strong>{" "}
                {formatDate(selectedRequest.startDate)} -{" "}
                {formatDate(selectedRequest.endDate)}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {calculateDays(
                  selectedRequest.startDate,
                  selectedRequest.endDate
                )}{" "}
                days
              </p>
              <p>
                <strong>Status:</strong> {formatStatus(selectedRequest.status)}
              </p>
              {/* Check for supporting documents and display a download link if available */}
              {selectedRequest.supportingDocs && (
                <p>
                  <strong>Documents:</strong>{" "}
                  <a
                    href={selectedRequest.supportingDocs}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </p>
              )}
            </div>
            <div className="leave-modal-footer">
              <button
                className="leave-approve-button"
                onClick={() =>
                  handleFinalDecision(selectedRequest.id, "approved")
                }
              >
                <CheckCircle className="leave-icon" /> Approve
              </button>
              <button
                className="leave-hold-button"
                onClick={() =>
                  handleFinalDecision(selectedRequest.id, "onHold")
                }
              >
                <PauseCircle className="leave-icon" /> On Hold
              </button>
              <button
                className="leave-reject-button"
                onClick={() =>
                  handleFinalDecision(selectedRequest.id, "rejected")
                }
              >
                <XCircle className="leave-icon" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditStatusModalOpen && selectedRequest && (
        <div className="leave-modal-overlay">
          <div className="leave-modal">
            <div className="leave-modal-header">
              <h2 className="leave-modal-title">Edit Leave Status</h2>
              <button
                onClick={() => setIsEditStatusModalOpen(false)}
                className="leave-close-button"
              >
                <XCircle className="leave-close-icon" />
              </button>
            </div>
            <p className="leave-modal-request-id">
              Request ID: {selectedRequest.id}
            </p>
            <div className="leave-modal-body">
              <p>
                <strong>Employee:</strong> {selectedRequest.name || "N/A"}
              </p>
              <p>
                <strong>Leave Type:</strong> {selectedRequest.leaveType}
              </p>
              <p>
                <strong> Status:</strong>{" "}
                <span
                  className={`status-badge ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status === "On_Hold"
                    ? "On Hold"
                    : selectedRequest.editStatus}
                </span>
              </p>
              <p>
                <strong>Previous Duration:</strong>{" "}
                {formatDate(selectedRequest.startDate)} -{" "}
                {formatDate(selectedRequest.endDate)}(
                {calculateDays(
                  selectedRequest.startDate,
                  selectedRequest.endDate
                )}{" "}
                days)
              </p>

              <p>
                <strong>New Duration:</strong>{" "}
                {formatDate(selectedRequest.startDateTemp)} -{" "}
                {formatDate(selectedRequest.endDateTemp)}(
                {calculateDays(
                  selectedRequest.startDateTemp,
                  selectedRequest.endDateTemp
                )}{" "}
                days)
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.reasonTemp}
              </p>
            </div>
            <div className="leave-modal-footer">
              <button
                className="leave-approve-button"
                onClick={() =>
                  handleEditFinalDecision(selectedRequest, "APPROVED")
                }
              >
                <CheckCircle className="leave-icon" /> Approve
              </button>
              <button
                className="leave-reject-button"
                onClick={() =>
                  handleEditFinalDecision(selectedRequest, "REJECTED")
                }
              >
                <XCircle className="leave-icon" /> Reject
              </button>
              <button
                className="leave-hold-button"
                onClick={() =>
                  handleEditFinalDecision(selectedRequest, "ON_HOLD")
                }
              >
                <PauseCircle className="leave-icon" /> On Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* cancel Status Modal */}
      {isCancelStatusModalOpen && selectedRequest && (
        <div className="leave-modal-overlay">
          <div className="leave-modal">
            <div className="leave-modal-header">
              <h2 className="leave-modal-title">Edit Leave Status</h2>
              <button
                onClick={() => setIsCancelStatusModalOpen(false)}
                className="leave-close-button"
              >
                <XCircle className="leave-close-icon" />
              </button>
            </div>
            <p className="leave-modal-request-id">
              Request ID: {selectedRequest.id}
            </p>
            <div className="leave-modal-body">
              <p>
                <strong>Employee:</strong> {selectedRequest.name || "N/A"}
              </p>
              <p>
                <strong>Leave Type:</strong> {selectedRequest.leaveType}
              </p>
              <p>
                <strong> Status:</strong>{" "}
                <span
                  className={`status-badge ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status === "On_Hold"
                    ? "On Hold"
                    : selectedRequest.editStatus}
                </span>
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {formatDate(selectedRequest.startDate)} -{" "}
                {formatDate(selectedRequest.endDate)}(
                {calculateDays(
                  selectedRequest.startDate,
                  selectedRequest.endDate
                )}{" "}
                days)
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.reasonTemp}
              </p>
            </div>
            <div className="leave-modal-footer">
              <button
                className="leave-approve-button"
                onClick={() =>
                  handleEditFinalDecision(selectedRequest, "APPROVED")
                }
              >
                <CheckCircle className="leave-icon" /> Approve
              </button>
              <button
                className="leave-reject-button"
                onClick={() =>
                  handleEditFinalDecision(selectedRequest, "REJECTED")
                }
              >
                <XCircle className="leave-icon" /> Reject
              </button>
              <button
                className="leave-hold-button"
                onClick={() =>
                  handleEditFinalDecision(selectedRequest, "ON_HOLD")
                }
              >
                <PauseCircle className="leave-icon" /> On Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
