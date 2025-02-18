import React, { useState } from 'react';
import './AttendanceDashboard.css';

const AttendanceDashboard = () => {
    const [filters, setFilters] = useState({
        location: '',
        department: '',
        name: '',
        startDate: '',
        endDate: ''
    });

    const [employees, setEmployees] = useState([
        // Mock Data - replace with actual employee data
        { id: 'GAL0001', name: 'Subham Roy', jobTitle: 'Engineer', phoneNumber: '7670035943', date: '2025-02-07', location: 'Silchar', department: 'Marketing', present: 20, absent: 2, halfDay: 1, paidLeave: 5, unpaidLeave: 0, overtime: 3, lateComing: 1 },
        { id: 'GAL0002', name: 'Bhaskar R', jobTitle: 'Engineer', phoneNumber: '9987856626', date: '2025-02-08', location: 'Bengaluru', department: 'Engineering', present: 18, absent: 4, halfDay: 0, paidLeave: 3, unpaidLeave: 1, overtime: 2, lateComing: 2 },
        { id: 'GAL0003', name: 'Salma Shirin', jobTitle: 'Sales', phoneNumber: '9954156767', date: '2025-04-27', location: 'Bengaluru', department: 'Marketing', present: 18, absent: 4, halfDay: 0, paidLeave: 3, unpaidLeave: 1, overtime: 2, lateComing: 2 },
        { id: 'GAL0004', name: 'Swarnadeep Deb', jobTitle: 'Engineer', phoneNumber: '234-567-8901', date: '2025-02-07', location: 'Silchar', department: 'Design', present: 18, absent: 4, halfDay: 0, paidLeave: 3, unpaidLeave: 1, overtime: 2, lateComing: 2 },
    ]);

    const locations = ['Bengaluru', 'Silchar', 'Remote'];
    const departments = ['Engineering', 'Design', 'Sales', 'Marketing'];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredEmployees = employees.filter(emp => {
        return (
            (!filters.location || emp.location === filters.location) &&
            (!filters.department || emp.department === filters.department) &&
            (!filters.name || emp.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (!filters.startDate || new Date(emp.date) >= new Date(filters.startDate)) &&
            (!filters.endDate || new Date(emp.date) <= new Date(filters.endDate))
        );
    });

    return (
        <div className="attendance-dashboard-container">
            <div className="attendance-dashboard-header">
                <h2>Attendance Dashboard</h2>
                <p className="attendance-dashboard-subtitle">Monitor and track daily attendance insights effortlessly</p>
            </div>


            <div className="attendance-dashboard-filters">
                {/* Row 1: Select Location and Department */}
                <div className="filter-group filter-row">
                    <label>Location</label>
                    <select name="location" onChange={handleFilterChange} value={filters.location}>
                        <option value="">All Locations</option>
                        {locations.map(location => <option key={location} value={location}>{location}</option>)}
                    </select>
                </div>

                <div className="filter-group filter-row">
                    <label>Department</label>
                    <select name="department" onChange={handleFilterChange} value={filters.department}>
                        <option value="">All Departments</option>
                        {departments.map(department => <option key={department} value={department}>{department}</option>)}
                    </select>
                </div>
            </div>

            <div className="attendance-dashboard-filters">
                <div className="filter-group filter-row">
                    <label>Employee Name</label>
                    <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Search by Name" />
                </div>

                <div className="filter-group filter-row">
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleDateRangeChange} />
                </div>

                <div className="filter-group filter-row">
                    <label>End Date</label>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleDateRangeChange} />
                </div>
            </div>

            <div className="download-report-container">
                <button className="download-report-button">Download Report</button>
            </div>

            <table className="attendance-dashboard-table">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Employee ID</th>
                        <th>Job Title</th>
                        <th>Phone Number</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Department</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Half Days</th>
                        <th>Paid Leave</th>
                        <th>Unpaid Leave</th>
                        <th>Overtime</th>
                        <th>Late Coming</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.id}</td>
                            <td>{employee.jobTitle}</td>
                            <td>{employee.phoneNumber}</td>
                            <td>{employee.date}</td>
                            <td>{employee.location}</td>
                            <td>{employee.department}</td>
                            <td>{employee.present}</td>
                            <td>{employee.absent}</td>
                            <td>{employee.halfDay}</td>
                            <td>{employee.paidLeave}</td>
                            <td>{employee.unpaidLeave}</td>
                            <td>{employee.overtime}</td>
                            <td>{employee.lateComing}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceDashboard;
