import React, { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, User, PauseCircle } from "lucide-react";
import "./Overtime.css";
 
export default function Overtime() {
    const [overtimeRequests, setOvertimeRequests] = useState([]);
    const [overtime, setOvertime] = useState([]);
    const [isDecisionTaken, setIsDecisionTaken] = useState(false);
    const [employeeMap, setEmployeeMap] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
 
    const handleFinalDecision = async (id, decision) => {
        let statusToUpdate = decision;
        // if (decision === "approved") {
        //     statusToUpdate = "REQUESTACCEPTED";
        // } else if (decision === "rejected") {
        //     statusToUpdate = "REQUESTREJECTED";
        // }
        try {
            const response = await fetch(
                `${API_BASE_URL_AT}/api/overtime/updateStatus/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ overtimeStatus: statusToUpdate }),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to update overtime request to ${statusToUpdate}`
                );
                
            } else {
                console.log("successfully done")
                const data=await response.json()
                console.log(data)
                setIsDecisionTaken((prev) => !prev);
            }
            // Refresh the list after update
            // fetchOvertimeRequests();
            setIsDetailsModalOpen(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const fetchOvertimeRequests=async()=>{
        try {
            const response=await fetch(`http://localhost:5003/at/api/overtime/getOvertime`,{
                method:"GET",
                headers:{
                    "Content-type":"application/json"

                }
               
            })
            const data=await response.json()
            console.log(data)
            setOvertime(data)

            
        } catch (error) {
            console.log(error)
            
        }
    }
 
    // Helper to format the status string as needed for display
    const formatStatus = (status) => {
        if (status === "On_Hold") {
            return "On Hold";
        }
        // return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };
 
    // Updated getStatusColor function returns the correct CSS class names defined in Overtime.css
    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "overtime-status-approved";
            case "Rejected":
                return "overtime-status-rejected";
            case "Pending":
                return "overtime-status-pending";
            case "On_Hold": // Also handle lower case with underscore
                return "overtime-status-onHold";
            default:
                return "overtime-status-default";
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
 
    // Fetch both overtime requests and employee data on component mount
    useEffect(() => {
        // fetchEmployees();
        fetchOvertimeRequests()
    }, [isDecisionTaken]);
 
    return (
        <div className="overtime-container">
            <div className="overtime-header">
                <div>
                    <h1 className="overtime-title">Overtime Requests</h1>
                    <p className="overtime-subtitle">
                        Manage and process employee overtime requests
                    </p>
                </div>
                {/* <button className="apply-overtime-button">Apply For Overtime</button> */}
            </div>
 
            <div className="overtime-filters">
                <input
                    type="text"
                    placeholder="Search by Employee Name or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="overtime-search-input"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="overtime-select-filter"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    {/* <option value="On_Hold">On Hold</option> */}
                </select>
            </div>
 
            <div className="overtime-table-container">
                <table className="overtime-table">
                    <thead className="overtime-table-head">
                        <tr>
                            <th className="overtime-table-header">
                                Employee Name
                            </th>
                            <th className="overtime-table-header">Department</th>
                            <th className="overtime-table-header">Applied On</th>
                            <th className="overtime-table-header">Overtime Date</th>
                            <th className="overtime-table-header">Overtime Start time</th>

                            <th className="overtime-table-header">
                                Overtime Duration
                            </th>
                            <th className="overtime-table-header">Status</th>
                            <th className="overtime-table-header overtime-text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="overtime-table-body">
                        {overtime
                            .filter((request) => {
                                const query = searchQuery.toLowerCase();
                                return (
                                    request.name
                                        ?.toLowerCase()
                                        .includes(query) ||
                                    request.employeeId
                                        ?.toLowerCase()
                                        .includes(query)
                                );
                            })
                            .filter((request) => {
                                if (filterStatus === "All") return true;
                                return request.status === filterStatus;
                            })
                            .map((request) => (
                                <tr
                                    key={request.id}
                                    className="overtime-table-row"
                                >
                                    <td className="overtime-table-cell">
                                        <div className="overtime-employee-info">
                                            <div className="overtime-employee-avatar">
                                                <User className="overtime-avatar-icon" />
                                            </div>
                                            <div className="overtime-employee-details">
                                                <div className="overtime-employee-name">
                                                    {request.employee.name || "N/A"}
                                                </div>
                                                <div className="overtime-employee-id">
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
                                    <td className="overtime-table-cell">
                                        {request.employee?.department || "N/A"}
                                    </td>
                                    <td className="overtime-table-cell">
                                        {formatDate(request.appliedOn)}
                                    </td>
                                    <td className="overtime-table-cell">
                                        {formatDate(request.date)}
                                    </td>
                                    <td className="overtime-table-cell">
                                        {formatDate(request.startTime)}
                                    </td>
                                    <td className="overtime-table-cell">
                                        <div>
                                            {`${Math.floor(request.duration / (1000 * 60 * 60))}hr 
                                            ${ Math.floor((request.duration % (1000 * 60 * 60)) / (1000 * 60))}m`}
                                        </div>
                                        
                                    </td>
                                    <td className="overtime-table-cell">
                                        <span
                                            className={`status-badge ${getStatusColor(
                                                request.overtimeStatus
                                            )}`}
                                        >
                                            {request.overtimeStatus === "null" ? "Not Requested" : request.overtimeStatus}
                                        </span>
                                    </td>
                                    <td className="overtime-t able-cell overtime-text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setIsDetailsModalOpen(true);
                                            }}
                                            className="overtime-details-button"
                                        >
                                            <Eye className="overtime-icon" /> View
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
 
            {isDetailsModalOpen && selectedRequest && (
                <div className="overtime-modal-overlay">
                    <div className="overtime-modal">
                        <div className="overtime-modal-header">
                            <h2 className="overtime-modal-title">
                                Overtime Details
                            </h2>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="overtime-close-button"
                            >
                                <XCircle className="overtime-close-icon" />
                            </button>
                        </div>
                        {/* <p className="overtime-modal-request-id">
                            Request ID: {selectedRequest.id}
                        </p> */}
                        <div className="overtime-modal-body">
                            <p>
                                <strong>Employee Name:</strong>{" "}
                                {selectedRequest.employee?.name || "N/A"}
                            </p>
                            <p>
                                <strong>Employee ID:</strong>{" "}
                                {selectedRequest.employeeId || employeeMap[selectedRequest.employeeId]?.name || "N/A"}
                            </p>
                            <p>
                                <strong>Overtime Start Time:</strong>{" "}
                                {`${new Date(selectedRequest.startTime).getHours()}:${new Date(selectedRequest.startTime).getMinutes()}`}
                            </p>
                            <p>
                                <strong>Overtime End Time:</strong>{" "}
                                {`${new Date(selectedRequest.endTime).getHours()}:${new Date(selectedRequest.endTime).getMinutes()}`}

                            </p>
                            <p>
                                <strong>Reason:</strong>{" "}
                                {selectedRequest.reason}
                            </p>
                        </div>
                        <div className="overtime-modal-footer">
                            <button
                                className="overtime-approve-button"
                                onClick={() =>
                                    handleFinalDecision(
                                        selectedRequest.id,
                                        "approved"
                                    )
                                }
                            >
                                <CheckCircle className="overtime-icon" /> Approve
                            </button>
                         
                            <button
                                className="overtime-reject-button"
                                onClick={() =>
                                    handleFinalDecision(
                                        selectedRequest.id,
                                        "rejected"
                                    )
                                }
                            >
                                <XCircle className="overtime-icon" /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}