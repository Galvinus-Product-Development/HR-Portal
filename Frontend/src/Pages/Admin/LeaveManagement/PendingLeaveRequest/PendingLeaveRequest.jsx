import React, { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, User, PauseCircle } from "lucide-react";
import "./PendingLeaveRequest.css";

const API_BASE_URL_LM= import.meta.env.VITE_API_BASE_URL_LM;
export default function PendingLeaveRequests() {
    // const [leaveRequests, setLeaveRequests] = useState({
    //     id:"",
    //     name:"",
    //     employeeId:"",
    //     status:"",
    //     leaveType:"",
    //     appliedOn:"",
    //     startDate:"",
    //     endDate:"",
    //     reason:"",
    //     supportingDocs:""
    // });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isDecisionTaken, setIsDecisionTaken] = useState(false);
    const [employeeMap, setEmployeeMap] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const fetchEmployees = async () => {
    //     try {
    //         const response = await fetch("${API_BASE_URL_LM}/api/employees");
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch employees");
    //         }
    //         const data = await response.json();

    //         console.log("Data",data)
    //         // Create a mapping from employeeId to employee details
    //         const empMap = [];

    //         data.forEach((emp) => {
    //             empMap.push({ name: emp.name, employeeId: emp.employeeId });
    //         });

    //         // Extract all leaveRequests from employees
    //         const allLeaveRequests = data.flatMap(emp => emp.leaveRequests || []);
    //         console.log("All Leave Request : ",allLeaveRequests)

    //         allLeaveRequests.map(emp=>{
    //             setLeaveRequests({
    //                 id:emp.id,
    //                 name:empMap.filter(employee=>employee.employeeId==emp.employeeId?employee.name:"N/A"),
    //                 employeeId:emp.employeeId,
    //                 status:emp.status,
    //                 leaveType:emp.leaveType,
    //                 startDate:emp.startDate,
    //                 endDate:emp.endDate,
    //                 appliedOn:emp.appliedOn,
    //                 reason:emp.reason,
    //                 supportingDocs:emp.supportingDocs
    //             })
    //         })

    //     } catch (err) {
    //         console.error("Error fetching employees:", err);
    //     }
    // };

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
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^",empMap);
            // Extract all leaveRequests from employees
            const allLeaveRequests = data.flatMap(
                (emp) => emp.leaveRequests || []
            );

            // Map leave requests and assign employee names correctly
            const leaveRequestsWithNames = allLeaveRequests.map((emp) => ({
                id: emp.id,
                name:
                    empMap.find(
                        (employee) => employee.employeeId === emp.employeeId
                    )?.name || "N/A", // ✅ Get correct name
                employeeId: emp.employeeId,
                status: emp.status,
                leaveType: emp.leaveType,
                startDate: emp.startDate,
                endDate: emp.endDate,
                appliedOn: emp.appliedOn,
                reason: emp.reason,
                supportingDocs: emp.supportingDocs,
            }));
            console.log("adsfafasfasfasfdasdfafd..........",leaveRequestsWithNames)
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
                throw new Error(
                    `Failed to update leave request to ${statusToUpdate}`
                );
            } else {
                setIsDecisionTaken((prev) => !prev);
            }
            // Refresh the list after update
            // fetchLeaveRequests();
            setIsDetailsModalOpen(false);
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
        // return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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

    // Calculate number of days between two dates (inclusive)
    const calculateDays = (startDateStr, endDateStr) => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const diffTime = endDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    // Fetch both leave requests and employee data on component mount
    useEffect(() => {
        fetchEmployees();
    }, [isDecisionTaken]);

    console.log("ALl leave request", leaveRequests);

    return (
        <div className="leave-container">
            <div className="leave-header">
                <div>
                    <h1 className="leave-title">Pending Leave Requests</h1>
                    <p className="leave-subtitle">
                        Manage and process employee leave requests
                    </p>
                </div>
                {/* <button className="apply-leave-button">Apply For Leave</button> */}
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
                            <th className="leave-table-header leave-text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="leave-table-body">
                        {leaveRequests.map((request) => (
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
                                                {employeeMap[request.employeeId]
                                                    ?.jobTitle
                                                    ? ` - ${
                                                          employeeMap[
                                                              request.employeeId
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
                                        style={{ color: "black" }}
                                    >
                                        {request?.status === "On_Hold" ? "On Hold" : request?.status}
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

                        {/* <tr
                                    key={leaveRequests.employeeId}
                                    className="leave-table-row"
                                >
                                    <td className="leave-table-cell">
                                        <div className="leave-employee-info">
                                            <div className="leave-employee-avatar">
                                                <User className="leave-avatar-icon" />
                                            </div>
                                            <div className="leave-employee-details">
                                                <div className="leave-employee-name">
                                                   {leaveRequests.employeeId}
                                                </div>
                                                <div className="leave-employee-id">
                                                    {leaveRequests.employeeId}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="leave-table-cell">
                                        {leaveRequests.leaveType}
                                    </td>
                                    <td className="leave-table-cell">
                                        <div>
                                            {formatDate(leaveRequests.startDate)} -{" "}
                                            {formatDate(leaveRequests.endDate)}
                                        </div>
                                        <div>
                                            {calculateDays(
                                                leaveRequests.startDate,
                                                leaveRequests.endDate
                                            )}{" "}
                                            days
                                        </div>
                                    </td>
                                    <td className="leave-table-cell">
                                        <span
                                            className={`status-badge ${getStatusColor(
                                                leaveRequests.status
                                            )}`}
                                        >
                                            {formatStatus(leaveRequests.status)}
                                        </span>
                                    </td>
                                    <td className="leave-table-cell">
                                        {formatDate(leaveRequests.appliedOn)}
                                    </td>
                                    <td className="leave-table-cell leave-text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(leaveRequests);
                                                setIsDetailsModalOpen(true);
                                            }}
                                            className="leave-details-button"
                                        >
                                            <Eye className="leave-icon" /> View
                                            Details
                                        </button>
                                    </td>
                                </tr> */}
                    </tbody>
                </table>
            </div>

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
                                {selectedRequest.employeeId ||
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
