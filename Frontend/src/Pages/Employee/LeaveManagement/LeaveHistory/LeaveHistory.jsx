// import React, { useState, useEffect } from "react";
// import { ChevronDown, Download } from "lucide-react";
// import "./LeaveHistory.css";

// const LeaveHistory = () => {
//     const [selectedMonth, setSelectedMonth] = useState("");
//     const [leaveHistory, setLeaveHistory] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [employeeId, setEmployeeId] = useState("");
//     const [employee, setEmployee] = useState(null);

//     useEffect(() => {
//         // Set current month as default (formatted as YYYY-MM)
//         const now = new Date();
//         const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
//         setSelectedMonth(currentMonth);

//         // Retrieve employee ID from localStorage
//         const id = localStorage.getItem("id");
//         if (id) {
//             setEmployeeId(id);
//         } else {
//             setError("Employee ID not found in local storage");
//         }
//     }, []);

//     // Fetch employee details once the employeeId is available
//     useEffect(() => {
//         if (employeeId) {
//             const fetchEmployee = async () => {
//                 try {
//                     const response = await fetch(`http://localhost:5005/api/employees/${employeeId}`);
//                     if (!response.ok) {
//                         throw new Error("Failed to fetch employee details");
//                     }
//                     const data = await response.json();
//                     setEmployee(data);
//                 } catch (err) {
//                     console.error("Error fetching employee details:", err);
//                     setError("Failed to load employee details");
//                 }
//             };
//             fetchEmployee();
//         }
//     }, [employeeId]);

//     // Fetch leave history when both employeeId and selectedMonth are set
//     useEffect(() => {
//         if (employeeId && selectedMonth) {
//             fetchLeaveHistory();
//         }
//     }, [employeeId, selectedMonth]);

//     const fetchLeaveHistory = async () => {
//         setLoading(true);
//         try {
//             const [year, month] = selectedMonth.split("-");
//             // Endpoint returns leave history for the given employee, year, and month
//             const response = await fetch(
//                 `http://localhost:5005/api/leave-history/employee/${employeeId}/${year}/${month}`
//             );
//             if (!response.ok) {
//                 throw new Error("Failed to fetch leave history");
//             }
//             const data = await response.json();
//             setLeaveHistory(data);
//             setError(null);
//         } catch (err) {
//             console.error("Error fetching leave history:", err);
//             setError("Failed to load leave history. Please try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Generate options for the past 12 months
//     const getMonthOptions = () => {
//         const options = [];
//         for (let i = 0; i < 12; i++) {
//             const date = new Date();
//             date.setMonth(date.getMonth() - i);
//             const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
//             const label = date.toLocaleString("default", {
//                 month: "long",
//                 year: "numeric",
//             });
//             options.push({ value, label, key: `${value}-${i}` });
//         }
//         return options;
//     };

//     const handleMonthChange = (e) => {
//         setSelectedMonth(e.target.value);
//     };

//     // Helper function to determine leave type display name
//     const getLeaveTypeDisplay = (type) => {
//         const types = {
//             CASUAL: "CL",
//             SICK: "SL",
//             COMPENSATORY: "Comp-off",
//         };
//         return types[type] || type;
//     };

//     // Helper function to format dates for display using the appliedOn field
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-US", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     // Handle document download/view
//     const handleViewDocument = (documentUrl) => {
//         if (documentUrl) {
//             window.open(documentUrl, "_blank");
//         }
//     };

//     return (
//         <div className="leave-history-container">
//             <div className="leave-history-header">
//                 <h2 className="leave-history-title">Leave History</h2>
//                 <div className="leave-history-select-wrapper">
//                     <select
//                         value={selectedMonth}
//                         onChange={handleMonthChange}
//                         className="leave-history-select"
//                     >
//                         {getMonthOptions().map((option) => (
//                             <option key={option.key} value={option.value}>
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                     <ChevronDown className="leave-history-dropdown-icon" />
//                 </div>
//             </div>

//             {error && <div className="leave-history-error">{error}</div>}

//             <div className="leave-history-table-container">
//                 {loading ? (
//                     <div className="leave-history-loading">
//                         Loading leave history...
//                     </div>
//                 ) : leaveHistory.length === 0 ? (
//                     <div className="leave-history-no-data">
//                         No leave records found for this month
//                     </div>
//                 ) : (
//                     <table className="leave-history-table">
//                         <thead>
//                             <tr>
//                                 <th>Date</th>
//                                 <th>Employee Name</th>
//                                 <th>Leave Type</th>
//                                 <th>Remarks</th>
//                                 <th>Duration</th>
//                                 <th>Status</th>
//                                 <th>Attachments</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {leaveHistory.map((record) => (
//                                 <tr key={record.id}>
//                                     {/* Format appliedOn date */}
//                                     <td>{formatDate(record.appliedOn)}</td>
//                                     {/* Use employee details from the Employee table */}
//                                     <td>{record.employee?.name || "N/A"}</td>
//                                     <td>
//                                         <span
//                                             className={`leave-type-badge ${getLeaveTypeDisplay(
//                                                 record.leaveType
//                                             ).toLowerCase()}`}
//                                         >
//                                             {getLeaveTypeDisplay(record.leaveType)}
//                                         </span>
//                                     </td>
//                                     {/* Display adminRemarks (or reason) */}
//                                     <td>{record.adminRemarks || "N/A"}</td>
//                                     {/* Display duration */}
//                                     <td>
//                                         {record.duration}{" "}
//                                         {record.duration === 1 ? "day" : "days"}
//                                     </td>
//                                     <td>
//                                         <span
//                                             className={`leave-status-badge ${record.status.toLowerCase()}`}
//                                         >
//                                             {record.status.charAt(0).toUpperCase() +
//                                                 record.status.slice(1).toLowerCase()}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         {record.supportingDocs ? (
//                                             <button
//                                                 className="leave-history-attachment"
//                                                 onClick={() =>
//                                                     handleViewDocument(record.supportingDocs)
//                                                 }
//                                             >
//                                                 <Download className="leave-history-attachment-icon" />
//                                                 View
//                                             </button>
//                                         ) : (
//                                             <span className="leave-history-no-attachment">
//                                                 None
//                                             </span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LeaveHistory;






import React, { useState, useEffect } from "react";
import { ChevronDown, Download } from "lucide-react";
import "./LeaveHistory.css";

const LeaveHistory = () => {
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeId, setEmployeeId] = useState("");
    const [employee, setEmployee] = useState(null);

    // Retrieve employee ID from localStorage on mount
    useEffect(() => {
        const id = localStorage.getItem("id");
        console.log("Local Storage", id);
        if (id) {
            setEmployeeId(id);
        } else {
            setError("Employee ID not found in local storage");
        }
    }, []);

    // Fetch employee details once employeeId is available
    useEffect(() => {
        if (employeeId) {
            const fetchEmployee = async () => {
                try {
                    const response = await fetch(`http://localhost:5005/api/employees/${employeeId}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch employee details");
                    }
                    const data = await response.json();
                    console.log("Employee",data);
                    setEmployee(data);
                } catch (err) {
                    console.error("Error fetching employee details:", err);
                    setError("Failed to load employee details");
                }
            };
            fetchEmployee();
        }
    }, [employeeId]);

    // Fetch all leave history records and filter by employeeId
    useEffect(() => {
        if (employeeId) {
            fetchLeaveHistory();
        }
    }, [employeeId]);

    const fetchLeaveHistory = async () => {
        // setLoading(true);
        try {
            const response = await fetch(`http://localhost:5005/api/leave-history/`);
            if (!response.ok) {
                throw new Error("Failed to fetch leave history");
            }
            const data = await response.json();
            console.log("Leave History", data);
            // Filter records for the particular employee using the stored employeeId
            const filteredData = data.filter(record => record.employeeId === employee?.id);
            setLeaveHistory(filteredData);
            setError(null);
        } catch (err) {
            console.error("Error fetching leave history:", err);
            setError("Failed to load leave history. Please try again later.");
        } finally {
            setLoading(false);
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

    return (
        <div className="leave-history-container">
            <div className="leave-history-header">
                <h2 className="leave-history-title">Leave History</h2>
            </div>

            {error && <div className="leave-history-error">{error}</div>}

            <div className="leave-history-table-container">
                {loading ? (
                    <div className="leave-history-loading">Loading leave history...</div>
                ) : leaveHistory.length === 0 ? (
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
                            {leaveHistory.map((record) => (
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
