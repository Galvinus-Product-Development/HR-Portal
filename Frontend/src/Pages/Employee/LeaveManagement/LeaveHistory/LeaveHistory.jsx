// import React, { useState, useEffect } from "react";
// import { ChevronDown, Download } from "lucide-react";
// import "./LeaveHistory.css";
// const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
// const LeaveHistory = () => {
//     const [leaveHistory, setLeaveHistory] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [employeeId, setEmployeeId] = useState("");
//     const [employee, setEmployee] = useState();

//     // CHANGE: Add new filters state (month, year, search, leaveType, status)
// 	const [filters, setFilters] = useState({            // --------------------------- CHANGED HERE ----------------------------------
// 		month: new Date().getMonth() + 1,
// 		year: new Date().getFullYear(),
// 		search: "",
// 		leaveType: "",
// 		status: ""
// 	});

//     const fetchEmployee = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL_LM}/api/employees/${employeeId}`);
//             if (!response.ok) {
//                 throw new Error("Failed to fetch employee details");
//             }
//             const data = await response.json();  
//             if(response.ok){
//                 setLeaveHistory(data.leaveHistory);
//             }                  
//             setEmployee(data);
//         } catch (err) {
//             console.error("Error fetching employee details:", err);
//             setError("Failed to load employee details");
//         }
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

//     // Helper function to format dates for display
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-US", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     	// CHANGE: Handle filter changes for new filters
// 	const handleFilterChange = (e) => {                 // --------------------------- CHANGED HERE ----------------------------------
// 		e.preventDefault();
// 		const { name, value } = e.target;
// 		setFilters(prev => ({ ...prev, [name]: value }));
// 	};

//     // Handle document download/view
//     const handleViewDocument = (documentUrl) => {
//         if (documentUrl) {
//             window.open(documentUrl, "_blank");
//         }
//     };

//     useEffect(() => {
//         const id = localStorage.getItem("userId");
//         console.log("Local Storage", id);
//         if (id) {
//             setEmployeeId(id);
//         } else {
//             setError("Employee ID not found in local storage");
//         }
//     }, []);

//     useEffect(() => {
//         if (employeeId) {
//             fetchEmployee();
//         }
//     }, [employeeId]);
    
//     return (
//         <div className="leave-history-container">
//             <div className="leave-history-header">
//                 <h2 className="leave-history-title">Leave History</h2>
//             </div>

//             {error && <div className="leave-history-error">{error}</div>}

// 			{/* ADD THIS new filters section above your table */}
// 			<div className="leave-history-filters">					{/* ------------------ CHANGED HERE ----------------- */}
// 				<div className="filter-group">
// 					<label>Month</label>
// 					<select name="month" onChange={handleFilterChange} value={filters.month}>
// 						{Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
// 							<option key={month} value={month}>
// 								{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
// 							</option>
// 						))}
// 					</select>
// 				</div>
// 				<div className="filter-group">
// 					<label>Year</label>
// 					<select name="year" onChange={handleFilterChange} value={filters.year}>
// 						{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
// 							<option key={year} value={year}>{year}</option>
// 						))}
// 					</select>
// 				</div>
// 				<div className="filter-group">
// 					<label>Search</label>
// 					<input
// 						type="text"
// 						name="search"
// 						placeholder="Employee Name or ID"
// 						onChange={handleFilterChange}
// 						value={filters.search}
// 					/>
// 				</div>
// 				<div className="filter-group">
// 					<label>Leave Type</label>
// 					<select name="leaveType" onChange={handleFilterChange} value={filters.leaveType}>
// 						<option value="">All</option>
// 						<option value="CASUAL">Casual</option>
// 						<option value="SICK">Sick</option>
// 						<option value="COMPENSATORY">Comp-Off</option>
// 					</select>
// 				</div>
// 				<div className="filter-group">
// 					<label>Status</label>
// 					<select name="status" onChange={handleFilterChange} value={filters.status}>
// 						<option value="">All</option>
// 						<option value="approved">Approved</option>
// 						<option value="rejected">Rejected</option>
// 						<option value="pending">Pending</option>
// 					</select>
// 				</div>
// 			</div>
//             <div className="leave-history-table-container">
//                 {loading ? (
//                     <div className="leave-history-loading">Loading leave history...</div>
//                 ) : leaveHistory?.length === 0 ? (
//                     <div className="leave-history-no-data">No leave records found</div>
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

// 						<tbody>							{/* -------------------- CHANGED HERE ---------------------- */}
// 							{leaveHistory
// 								.filter((record) => {
// 									// Filter by search field (Employee Name or ID)
// 									if (filters.search) {
// 										const searchTerm = filters.search.toLowerCase();
// 										const empName = (record.employee?.name || employee?.name || "").toLowerCase();
// 										const empId = record.employeeId ? record.employeeId.toLowerCase() : "";
// 										if (!empName.includes(searchTerm) && !empId.includes(searchTerm)) {
// 											return false;
// 										}
// 									}
// 									// Filter by leave type
// 									if (filters.leaveType && record.leaveType !== filters.leaveType) {
// 										return false;
// 									}
// 									// Filter by status
// 									if (filters.status && record.status.toLowerCase() !== filters.status.toLowerCase()) {
// 										return false;
// 									}
// 									// NEW: Filter by Month and Year using record.appliedOn
// 									const appliedDate = new Date(record.appliedOn);
// 									if (
// 										appliedDate.getMonth() + 1 !== Number(filters.month) ||
// 										appliedDate.getFullYear() !== Number(filters.year)
// 									) {
// 										return false;
// 									}
// 									return true;
// 								})
// 								.map((record) => (
// 									// Your existing row rendering
// 									<tr key={record.id}>
// 										<td>{formatDate(record.appliedOn)}</td>
// 										<td>{record.employee?.name || employee?.personalDetails?.name || "N/A"}</td>
// 										<td>
// 											<span className={`leave-type-badge ${getLeaveTypeDisplay(record.leaveType).toLowerCase()}`}>
// 												{getLeaveTypeDisplay(record.leaveType)}
// 											</span>
// 										</td>
// 										<td>{record.adminRemarks || "N/A"}</td>
// 										<td>
// 											{record.duration} {record.duration === 1 ? "day" : "days"}
// 										</td>
// 										<td>
// 											<span className={`leave-status-badge ${record.status.toLowerCase()}`}>
// 												{record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()}
// 											</span>
// 										</td>
// 										<td>
// 											{record.supportingDocs ? (
// 												<button
// 													className="leave-history-attachment"
// 													onClick={() => handleViewDocument(record.supportingDocs)}
// 												>
// 													<Download className="leave-history-attachment-icon" />
// 													View
// 												</button>
// 											) : (
// 												<span className="leave-history-no-attachment">None</span>
// 											)}
// 										</td>
// 									</tr>
// 								))}
// 						</tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LeaveHistory;








import React, { useState, useEffect } from "react";
import { ChevronDown, Download, Edit, X, Calendar } from "lucide-react";
import "./LeaveHistory.css";
const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;

const LeaveHistory = () => {
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeId, setEmployeeId] = useState("");
    const [employee, setEmployee] = useState();
    
    // Added modal states for editing
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLeave, setCurrentLeave] = useState(null);
    const [editFormData, setEditFormData] = useState({
		editStatus:"",
        startDate: "",
        endDate: "",
        comment: ""
    });
    
    // Added state for confirmation modal
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [leaveToCancel, setLeaveToCancel] = useState(null);

    // CHANGE: Add new filters state (month, year, search, leaveType, status)
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        search: "",
        leaveType: "",
        status: ""
    });

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL_LM}/api/employees/${employeeId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch employee details");
            }
            const data = await response.json();  
            if(response.ok){
                setLeaveHistory(data.leaveRequests);
            }                  
            setEmployee(data);
			console.log("this is history data:-",data)
        } catch (err) {
            console.error("Error fetching employee details:", err);
            setError("Failed to load employee details");
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

    // CHANGE: Handle filter changes for new filters
    const handleFilterChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle document download/view
    const handleViewDocument = (documentUrl) => {
        if (documentUrl) {
            window.open(documentUrl, "_blank");
        }
    };
    
    // Add handler for editing leave request
    const handleEditLeave = (leave) => {
        setCurrentLeave(leave);
        setEditFormData({
            startDate: formatDateForInput(leave.startDate || ""),
            endDate: formatDateForInput(leave.endDate || ""),
            comment: ""
        });
        setIsEditModalOpen(true);
    };
    
    // Format date for input field (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    
    // Handle input changes in edit form
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

	 // Calculate number of days between two dates (inclusive)
	 const calculateDays = (startDateStr, endDateStr) => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const diffTime = endDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };
    
    // Submit leave modification
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            // Calculate new duration based on start and end dates
            const formattedStartDate = new Date(`${editFormData.startDate}T00:00:00Z`).toISOString();
  const formattedEndDate = new Date(`${editFormData.endDate}T00:00:00Z`).toISOString();

            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates
            
            // Prepare data for API
            const updateData = {
                leaveId: currentLeave.id,
                startDateTemp: formattedStartDate,
                endDateTemp: formattedEndDate,
				editStatus:"EDITED",  
                reasonTemp: editFormData.comment
            };
            
            // API call to update leave request
            const response = await fetch(`${API_BASE_URL_LM}/api/leave-requests/${currentLeave.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            
            if (!response.ok) {
                throw new Error("Failed to update leave request");
            }
            
            // Refresh employee data to get updated leave history
            await fetchEmployee();
			
			const data=await response.json()
			console.log("this is edit data for leave request",data)
            
            // Close modal and show success message
            setIsEditModalOpen(false);
            // You can add a success toast notification here
            
        } catch (err) {
            console.error("Error updating leave request:", err);
            setError("Failed to update leave request. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Handle cancel leave request button click
    const handleCancelLeaveButton = (leave) => {
        setLeaveToCancel(leave);
        setIsCancelModalOpen(true);
    };
    
    // Handle actual leave cancellation
    const handleConfirmCancelLeave = async () => {
        try {
            setLoading(true);
            
            // API call to cancel leave request
            const response = await fetch(`${API_BASE_URL_LM}/api/leaves/cancel/${leaveToCancel.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error("Failed to cancel leave request");
            }
            
            // Refresh employee data to get updated leave history
            await fetchEmployee();
            
            // Close modal and show success message
            setIsCancelModalOpen(false);
            // You can add a success toast notification here
            
        } catch (err) {
            console.error("Error cancelling leave request:", err);
            setError("Failed to cancel leave request. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Check if leave can be modified (e.g., only pending leaves)
    const canModifyLeave = (leave) => {
         return leave.status.toLowerCase() === "approved";
		
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

            {/* ADD THIS new filters section above your table */}
            <div className="leave-history-filters">
                <div className="filter-group">
                    <label>Month</label>
                    <select name="month" onChange={handleFilterChange} value={filters.month}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                                {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Year</label>
                    <select name="year" onChange={handleFilterChange} value={filters.year}>
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Search</label>
                    <input
                        type="text"
                        name="search"
                        placeholder="Employee Name or ID"
                        onChange={handleFilterChange}
                        value={filters.search}
                    />
                </div>
                <div className="filter-group">
                    <label>Leave Type</label>
                    <select name="leaveType" onChange={handleFilterChange} value={filters.leaveType}>
                        <option value="">All</option>
                        <option value="CASUAL">Casual</option>
                        <option value="SICK">Sick</option>
                        <option value="COMPENSATORY">Comp-Off</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Status</label>
                    <select name="status" onChange={handleFilterChange} value={filters.status}>
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>
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
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {leaveHistory
                                .filter((record) => {
                                    // Filter by search field (Employee Name or ID)
                                    if (filters.search) {
                                        const searchTerm = filters.search.toLowerCase();
                                        const empName = (record.employee?.name || employee?.name || "").toLowerCase();
                                        const empId = record.employeeId ? record.employeeId.toLowerCase() : "";
                                        if (!empName.includes(searchTerm) && !empId.includes(searchTerm)) {
                                            return false;
                                        }
                                    }
                                    // Filter by leave type
                                    if (filters.leaveType && record.leaveType !== filters.leaveType) {
                                        return false;
                                    }
                                    // Filter by status
                                    if (filters.status && record.status.toLowerCase() !== filters.status.toLowerCase()) {
                                        return false;
                                    }
                                    // NEW: Filter by Month and Year using record.appliedOn
                                    const appliedDate = new Date(record.appliedOn);
                                    if (
                                        appliedDate.getMonth() + 1 !== Number(filters.month) ||
                                        appliedDate.getFullYear() !== Number(filters.year)
                                    ) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((record) => (
                                    // Your existing row rendering
                                    <tr key={record.id}>
                                        <td>{formatDate(record.appliedOn)}</td>
                                        <td>{record.employee?.name || employee?.personalDetails?.name || "N/A"}</td>
                                        <td>
                                            <span className={`leave-type-badge ${getLeaveTypeDisplay(record.leaveType).toLowerCase()}`}>
                                                {getLeaveTypeDisplay(record.leaveType)}
                                            </span>
                                        </td>
                                        <td>{record.adminRemarks || "N/A"}</td>
                                        <td>
                                            {calculateDays(record.startDate,record.endDate)} {record.duration === 1 ? "day" : "days"}
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
                                        <td>
                                            {canModifyLeave(record) && (
                                                <div className="leave-actions">
                                                    <button
                                                        className="leave-edit-btn"
                                                        onClick={() => handleEditLeave(record)}
                                                        title="Edit leave request"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        className="leave-cancel-btn"
                                                        onClick={() => handleCancelLeaveButton(record)}
                                                        title="Cancel leave request"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* Edit Leave Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="leave-edit-modal">
                        <div className="modal-header">
                            <h3>Modify Leave Request</h3>
                            <button className="close-modal" onClick={() => setIsEditModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitEdit}>
                            <div className="form-group">
                                <label htmlFor="startDate">Start Date</label>
                                <div className="date-input-wrapper">
                                    <Calendar size={16} className="date-icon" />
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={editFormData.startDate}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="endDate">End Date</label>
                                <div className="date-input-wrapper">
                                    <Calendar size={16} className="date-icon" />
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={editFormData.endDate}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">Comment</label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={editFormData.comment}
                                    onChange={handleEditFormChange}
                                    placeholder="Reason for leave modification"
                                    rows={3}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn" >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Cancel Leave Confirmation Modal */}
            {isCancelModalOpen && (
                <div className="modal-overlay">
                    <div className="leave-cancel-modal">
                        <div className="modal-header">
                            <h3>Cancel Leave Request</h3>
                            <button className="close-modal" onClick={() => setIsCancelModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-content">
                            <p>Are you sure you want to cancel this leave request?</p>
                            <p>
                                <strong>Leave Type:</strong> {getLeaveTypeDisplay(leaveToCancel?.leaveType)}
                                <br />
                                <strong>Duration:</strong> {leaveToCancel?.duration} {leaveToCancel?.duration === 1 ? "day" : "days"}
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsCancelModalOpen(false)}>
                                No, Keep It
                            </button>
                            <button 
                                type="button" 
                                className="confirm-cancel-btn" 
                                onClick={handleConfirmCancelLeave}
                            >
                                Yes, Cancel Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveHistory;