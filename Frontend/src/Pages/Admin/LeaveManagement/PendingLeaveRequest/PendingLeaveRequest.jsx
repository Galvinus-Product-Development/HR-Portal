import React, { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, User, PauseCircle } from "lucide-react";
import "./PendingLeaveRequest.css";

export default function PendingLeaveRequests() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [employeeMap, setEmployeeMap] = useState({});
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch both leave requests and employee data on component mount
    useEffect(() => {
        fetchLeaveRequests();
        fetchEmployees();
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:5005/api/leave-requests"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch leave requests");
            }
            const data = await response.json();
            setLeaveRequests(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching leave requests:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5005/api/employees");
            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }
            const data = await response.json();
            // Create a mapping from employee id to employee details
            const empMap = {};
            data.forEach((emp) => {
                empMap[emp.id] = emp;
            });
            setEmployeeMap(empMap);
        } catch (err) {
            console.error("Error fetching employees:", err);
        }
    };

    // Update leave request status in the backend (no immediate deletion)
    const updateLeaveRequestStatus = async (id, status) => {
        try {
            const response = await fetch(
                `http://localhost:5005/api/leave-requests/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to update leave request to ${status}`);
            }
            // Refresh the list after update
            fetchLeaveRequests();
            setIsDetailsModalOpen(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    // Handle final decision for leave requests.
    // For onHold, update with ON_HOLD; for approved or rejected, update accordingly.
    // The backend updateLeaveRequest function sets decisionAt and creates a history record.
    const handleFinalDecision = async (id, decision) => {
        let statusToUpdate = decision.toUpperCase();
        if (decision === "onHold") {
            statusToUpdate = "ON_HOLD";
        }
        try {
            const response = await fetch(
                `http://localhost:5005/api/leave-requests/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: statusToUpdate }),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to update leave request to ${statusToUpdate}`
                );
            }
            // Refresh the list after update
            fetchLeaveRequests();
            setIsDetailsModalOpen(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    // Helper to format the status string as needed for display
    const formatStatus = (status) => {
        if (status === "ON_HOLD") {
            return "ON HOLD";
        }
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    // Updated getStatusColor function returns the correct CSS class names defined in PendingLeaveRequest.css
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "leave-status-approved";
            case "rejected":
                return "leave-status-rejected";
            case "pending":
                return "leave-status-pending";
            case "on_hold": // Also handle lower case with underscore
                return "leave-status-onHold";
            default:
                return "leave-status-default";
        }
    };

    // Filtering logic: normalize status values by removing underscores and lowercasing, then sort by appliedOn date (most recent first)
    const filteredRequests = leaveRequests
        .filter((request) => {
            if (filterStatus === "all") return true;
            const normalizedRequestStatus = request.status
                .replace(/_/g, "")
                .toLowerCase();
            const normalizedFilter = filterStatus
                .replace(/_/g, "")
                .toLowerCase();
            return normalizedRequestStatus === normalizedFilter;
        })
        .filter((request) => {
            const empName =
                request.employeeName ||
                employeeMap[request.employeeId]?.name ||
                "";
            const empId = request.employeeId || "";
            return (
                empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                empId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));

    // Helper function to format date as DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    // Calculate number of days between two dates (inclusive)
    const calculateDays = (startDateStr, endDateStr) => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const diffTime = endDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    return (
        <div className="leave-container">
            <div className="leave-header">
                <div>
                    <h1 className="leave-title">Pending Leave Requests</h1>
                    <p className="leave-subtitle">
                        Manage and process employee leave requests
                    </p>
                </div>
                <button className="apply-leave-button">Apply For Leave</button>
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
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="onHold">On Hold</option>
                </select>
            </div>

            {loading ? (
                <p>Loading leave requests...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="leave-table-container">
                    <table className="leave-table">
                        <thead className="leave-table-head">
                            <tr>
                                <th className="leave-table-header">Employee</th>
                                <th className="leave-table-header">
                                    Leave Type
                                </th>
                                <th className="leave-table-header">Duration</th>
                                <th className="leave-table-header">Status</th>
                                <th className="leave-table-header">
                                    Applied On
                                </th>
                                <th className="leave-table-header leave-text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="leave-table-body">
                            {filteredRequests.map((request) => (
                                <tr
                                    key={request.id}
                                    className="leave-table-row"
                                >
                                    <td className="leave-table-cell">
                                        <div className="leave-employee-info">
                                            <div className="leave-employee-avatar">
                                                <User className="leave-avatar-icon" />
                                            </div>
                                            <div className="leave-employee-details">
                                                <div className="leave-employee-name">
                                                    {request.employeeName ||
                                                        employeeMap[
                                                            request.employeeId
                                                        ]?.name ||
                                                        "N/A"}
                                                </div>
                                                <div className="leave-employee-id">
                                                    {request.employeeId ||
                                                        "N/A"}{" "}
                                                    {employeeMap[
                                                        request.employeeId
                                                    ]?.jobTitle
                                                        ? ` - ${
                                                              employeeMap[
                                                                  request
                                                                      .employeeId
                                                              ].jobTitle
                                                          }`
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="leave-table-cell">
                                        {request.leaveType}
                                    </td>
                                    <td className="leave-table-cell">
                                        <div>
                                            {formatDate(request.startDate)} -{" "}
                                            {formatDate(request.endDate)}
                                        </div>
                                        <div>
                                            {calculateDays(
                                                request.startDate,
                                                request.endDate
                                            )}{" "}
                                            days
                                        </div>
                                    </td>
                                    <td className="leave-table-cell">
                                        <span
                                            className={`status-badge ${getStatusColor(
                                                request.status
                                            )}`}
                                        >
                                            {formatStatus(request.status)}
                                        </span>
                                    </td>
                                    <td className="leave-table-cell">
                                        {formatDate(request.appliedOn)}
                                    </td>
                                    <td className="leave-table-cell leave-text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setIsDetailsModalOpen(true);
                                            }}
                                            className="leave-details-button"
                                        >
                                            <Eye className="leave-icon" /> View
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isDetailsModalOpen && selectedRequest && (
                <div className="leave-modal-overlay">
                    <div className="leave-modal">
                        <div className="leave-modal-header">
                            <h2 className="leave-modal-title">
                                Leave Request Details
                            </h2>
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
                                <strong>Employee Name:</strong>{" "}
                                {selectedRequest.employeeName ||
                                    employeeMap[selectedRequest.employeeId]
                                        ?.name ||
                                    "N/A"}
                            </p>
                            <p>
                                <strong>Leave Type:</strong>{" "}
                                {selectedRequest.leaveType}
                            </p>
                            <p>
                                <strong>Reason:</strong>{" "}
                                {selectedRequest.reason}
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
                                <strong>Status:</strong>{" "}
                                {formatStatus(selectedRequest.status)}
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
                                    handleFinalDecision(
                                        selectedRequest.id,
                                        "approved"
                                    )
                                }
                            >
                                <CheckCircle className="leave-icon" /> Approve
                            </button>
                            <button
                                className="leave-hold-button"
                                onClick={() =>
                                    handleFinalDecision(
                                        selectedRequest.id,
                                        "onHold"
                                    )
                                }
                            >
                                <PauseCircle className="leave-icon" /> On Hold
                            </button>
                            <button
                                className="leave-reject-button"
                                onClick={() =>
                                    handleFinalDecision(
                                        selectedRequest.id,
                                        "rejected"
                                    )
                                }
                            >
                                <XCircle className="leave-icon" /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
