import React, { useState, useEffect } from "react";
import { ChevronDown, Download } from "lucide-react";
import "./LeaveHistory.css";
const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
const LeaveHistory = () => {
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeId, setEmployeeId] = useState("");
    const [employee, setEmployee] = useState();

    const fetchEmployee = async () => {
        try {
            const response = await fetch(`${API_BASE_URL_LM}/api/employees/${employeeId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch employee details");
            }
            const data = await response.json();  
            if(response.ok){
                setLeaveHistory(data.leaveHistory);
            }                  
            setEmployee(data);
        } catch (err) {
            console.error("Error fetching employee details:", err);
            setError("Failed to load employee details");
        }
    };

    // Helper function to determine leave type display name
    const getLeaveTypeDisplay = (type) => {
        const types = {
            CASUAL: "CL",
            SICK: "SL",
            COMPENSATORY: "Comp-off",
        };
        return types[type] || type;
    };

    // Helper function to format dates for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Handle document download/view
    const handleViewDocument = (documentUrl) => {
        if (documentUrl) {
            window.open(documentUrl, "_blank");
        }
    };

    useEffect(() => {
        const id = localStorage.getItem("userId");
        console.log("Local Storage", id);
        if (id) {
            setEmployeeId(id);
        } else {
            setError("Employee ID not found in local storage");
        }
    }, []);

    useEffect(() => {
        if (employeeId) {
            fetchEmployee();
        }
    }, [employeeId]);
    
    return (
        <div className="leave-history-container">
            <div className="leave-history-header">
                <h2 className="leave-history-title">Leave History</h2>
            </div>

            {error && <div className="leave-history-error">{error}</div>}

            <div className="leave-history-table-container">
                {loading ? (
                    <div className="leave-history-loading">Loading leave history...</div>
                ) : leaveHistory?.length === 0 ? (
                    <div className="leave-history-no-data">No leave records found</div>
                ) : (
                    <table className="leave-history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Employee Name</th>
                                <th>Leave Type</th>
                                <th>Remarks</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Attachments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employee.leaveHistory.map((record) => (
                                <tr key={record.id}>
                                    <td>{formatDate(record.appliedOn)}</td>
                                    <td>{record.employee?.name || employee?.name || "N/A"}</td>
                                    <td>
                                        <span className={`leave-type-badge ${getLeaveTypeDisplay(record.leaveType).toLowerCase()}`}>
                                            {getLeaveTypeDisplay(record.leaveType)}
                                        </span>
                                    </td>
                                    <td>{record.adminRemarks || "N/A"}</td>
                                    <td>
                                        {record.duration} {record.duration === 1 ? "day" : "days"}
                                    </td>
                                    <td>
                                        <span className={`leave-status-badge ${record.status.toLowerCase()}`}>
                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {record.supportingDocs ? (
                                            <button
                                                className="leave-history-attachment"
                                                onClick={() => handleViewDocument(record.supportingDocs)}
                                            >
                                                <Download className="leave-history-attachment-icon" />
                                                View
                                            </button>
                                        ) : (
                                            <span className="leave-history-no-attachment">None</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LeaveHistory;
