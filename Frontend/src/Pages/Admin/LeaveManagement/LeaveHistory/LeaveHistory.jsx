import React, { useState, useEffect } from 'react';
import { Search, Download, User } from 'lucide-react';
import './LeaveHistory.css';

export default function LeaveHistory() {
    // State initialization
    // (Optionally, you can initialize selectedMonth to the current month)
    const defaultMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth || '2024-03');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [employees, setEmployees] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employee data only once on mount
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Fetch leave history whenever selectedMonth or filterStatus changes
    useEffect(() => {
        fetchLeaveHistory();
    }, [selectedMonth, filterStatus]);

    // Fetch employee data for quick lookup of employee details
    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5005/api/employees');
            if (!response.ok) {
                throw new Error(`Failed to fetch employees: ${response.statusText}`);
            }
            const data = await response.json();
            // Create a map of employee ID to employee details
            const employeeMap = {};
            data.forEach(employee => {
                employeeMap[employee.id] = employee;
            });
            setEmployees(employeeMap);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    // Fetch leave history using selected month and status filter
    const fetchLeaveHistory = async () => {
        try {
            setLoading(true);
            const [year, month] = selectedMonth.split('-');
            let url = 'http://localhost:5005/api/leave-history';
            const queryParams = new URLSearchParams();
            if (year && month) {
                queryParams.append('year', year);
                queryParams.append('month', month);
            }
            if (filterStatus !== 'all') {
                queryParams.append('status', filterStatus);
            }
            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch leave history: ${response.statusText}`);
            }
            const data = await response.json();
            // Process data: if appliedOn and duration are provided, compute start and end dates
            const processedData = data.map(record => {
                if (record.appliedOn && record.duration) {
                    const appliedDate = new Date(record.appliedOn);
                    const startDate = new Date(appliedDate);
                    const endDate = new Date(appliedDate);
                    endDate.setDate(endDate.getDate() + record.duration - 1);
                    return {
                        ...record,
                        startDate: startDate,
                        endDate: endDate
                    };
                }
                return record;
            });
            setLeaveHistory(processedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching leave history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle exporting the filtered leave history data
    const handleExport = async () => {
        try {
            const [year, month] = selectedMonth.split('-');
            let url = '/api/leave-history/export';
            const queryParams = new URLSearchParams();
            if (year && month) {
                queryParams.append('year', year);
                queryParams.append('month', month);
            }
            if (filterStatus !== 'all') {
                queryParams.append('status', filterStatus);
            }
            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }
            window.open(url, '_blank');
        } catch (err) {
            console.error('Error exporting leave history:', err);
            setError('Failed to export leave history. Please try again.');
        }
    };

    // Handle downloading documents for a particular leave record
    const handleDocumentDownload = async (recordId, documentName) => {
        try {
            const url = `/api/leave-history/${recordId}/documents/${encodeURIComponent(documentName)}`;
            window.open(url, '_blank');
        } catch (err) {
            console.error('Error downloading document:', err);
            setError('Failed to download document. Please try again.');
        }
    };

    // Generate month options for the select box (last 12 months)
    const getMonthOptions = () => {
        const options = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            options.push({ value, label });
        }
        return options;
    };

    // Utility function to return CSS class based on leave status
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
            case 'APPROVED':
                return 'approved-status';
            case 'rejected':
            case 'REJECTED':
                return 'rejected-status';
            case 'pending':
            case 'PENDING':
                return 'pending-status';
            default:
                return 'default-status';
        }
    };

    // Client-side filtering: search by employee name or employee ID (using the employees lookup)
    const filteredHistory = leaveHistory
        .filter(record => {
            const employeeName = employees[record.employeeId]?.name || '';
            const employeeId = record.employeeId || '';
            return (
                employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employeeId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));

    // Format a date string into DD/MM/YYYY format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB');
        } catch (err) {
            console.error('Error formatting date:', err);
            return 'Invalid Date';
        }
    };

    // Convert leave type enum values (e.g., "CASUAL") into "Casual"
    const formatLeaveType = (leaveType) => {
        if (!leaveType) return 'N/A';
        return leaveType.charAt(0) + leaveType.slice(1).toLowerCase();
    };

    return (
        <div className="leave-history-container">
            <div className="header-section">
                <h1 className="title">Leave History</h1>
                <p className="description">View and manage employee leave history</p>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by employee name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="select-boxes">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="month-selector"
                    >
                        {getMonthOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-selector"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        {/* <option value="pending">Pending</option> */}
                    </select>
                    <button className="export-button" onClick={handleExport}>
                        <Download className="download-icon" />
                        Export
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    Error: {error}
                </div>
            )}

            {loading ? (
                <div className="loading-container">
                    <p>Loading leave history...</p>
                </div>
            ) : (
                <div className="leave-history-table">
                    {filteredHistory.length === 0 ? (
                        <div className="no-data-message">
                            No leave history records found for the selected filters.
                        </div>
                    ) : (
                        <table className="table">
                            <thead className="table-head">
                                <tr>
                                    <th>Employee</th>
                                    <th>Leave Details</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((record) => (
                                    <tr key={record.id} className="table-row">
                                        <td className="employee--info">
                                            <User className="user-icon" />
                                            <div>
                                                <div className="employee-name">
                                                    {employees[record.employeeId]?.name || 'N/A'}
                                                </div>
                                                <div className="employee-id">
                                                    {record.employeeId || 'N/A'}
                                                    {employees[record.employeeId]?.jobTitle &&
                                                        ` - ${employees[record.employeeId].jobTitle}`}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="leave-details">
                                            <div>{formatLeaveType(record.leaveType)}</div>
                                        </td>
                                        <td className="duration">
                                            <div>
                                                {formatDate(record.startDate)} - {formatDate(record.endDate)}
                                            </div>
                                            <div>{record.duration || 0} days</div>
                                        </td>
                                        <td className="status">
                                            <span className={`status-badge ${getStatusColor(record.status)}`}>
                                                {record.status
                                                    ? record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()
                                                    : 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
