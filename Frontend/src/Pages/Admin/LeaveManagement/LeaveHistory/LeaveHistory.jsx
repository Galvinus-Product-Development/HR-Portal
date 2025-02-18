import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Calendar,
    FileText,
    User,
    ChevronDown
} from 'lucide-react';
import './LeaveHistory.css';

export default function LeaveHistory() {
    const [selectedMonth, setSelectedMonth] = useState('2024-03');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const leaveHistory = [
        {
            id: 'GAL0001',
            employeeName: 'Subham Roy',
            employeeId: 'GAL0001',
            department: 'Engineering',
            leaveType: 'Annual Leave',
            startDate: '2024-03-20',
            endDate: '2024-03-22',
            duration: 3,
            reason: 'Family vacation',
            status: 'approved',
            appliedOn: '2024-03-15',
            actionDate: '2024-03-16',
            actionBy: 'HR Manager',
            documents: ['vacation_plan.pdf']
        },
        {
            id: 'GAL0002',
            employeeName: 'Bhaskar R',
            employeeId: 'GAL0002',
            department: 'Marketing',
            leaveType: 'Sick Leave',
            startDate: '2024-03-18',
            endDate: '2024-03-19',
            duration: 2,
            reason: 'Medical appointment',
            status: 'rejected',
            appliedOn: '2024-03-14',
            actionDate: '2024-03-15',
            actionBy: 'Department Head',
            documents: ['medical_certificate.pdf']
        },
        {
            id: 'GAL0003',
            employeeName: 'Salma Shirin',
            employeeId: 'GAL0003',
            department: 'Marketing',
            leaveType: 'Sick Leave',
            startDate: '2024-03-18',
            endDate: '2024-03-19',
            duration: 2,
            reason: 'Medical appointment',
            status: 'rejected',
            appliedOn: '2024-03-14',
            actionDate: '2024-03-15',
            actionBy: 'Department Head',
            documents: ['medical_certificate.pdf']
        }
    ];

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'approved-status';
            case 'rejected':
                return 'rejected-status';
            default:
                return 'default-status';
        }
    };

    const filteredHistory = leaveHistory
        .filter(record => filterStatus === 'all' || record.status === filterStatus)
        .filter(record =>
            record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        );

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
                    </select>

                    <button className="export-button">
                        <Download className="download-icon" />
                        Export
                    </button>
                </div>
            </div>

            <div className="leave-history-table">
                <table className="table">
                    <thead className="table-head">
                        <tr>
                            <th>Employee</th>
                            <th>Leave Details</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Action Info</th>
                            <th>Documents</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.map((record) => (
                            <tr key={record.id} className="table-row">
                                <td className="employee--info">
                                    <User className="user-icon" />
                                    <div>
                                        <div className="employee-name">{record.employeeName}</div>
                                        <div className="employee-id">{record.employeeId}</div>
                                    </div>
                                </td>
                                <td className="leave-details">
                                    <div>{record.leaveType}</div>
                                    <div>{record.department}</div>
                                </td>
                                <td className="duration">
                                    <div>{new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}</div>
                                    <div>{record.duration} days</div>
                                </td>
                                <td className="status">
                                    <span className={`status-badge ${getStatusColor(record.status)}`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                </td>
                                <td className="action-info">
                                    <div>By: {record.actionBy}</div>
                                    <div>On: {new Date(record.actionDate).toLocaleDateString()}</div>
                                </td>
                                <td className="documents">
                                    {record.documents && record.documents.length > 0 && (
                                        <button className="document-button">
                                            <FileText className="file-icon" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
