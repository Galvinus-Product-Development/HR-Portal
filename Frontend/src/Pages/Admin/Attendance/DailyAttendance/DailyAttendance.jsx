import React, { useState } from 'react';
import { ClipboardCheck, X } from 'lucide-react';
import './DailyAttendance.css';

const DailyAttendance = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        department: '',
        status: ''
    });

    const mockEmployees = [
        { id: '', name: 'Subham Roy', department: 'Engineering', location: 'Silchar', status: 'Present', punchIn: '10:30', punchOut: '17:30' },
        { id: '', name: 'Salma Shirin', department: 'Design', location: 'Remote', status: 'Half Day', punchIn: '10:30', punchOut: '13:30' },
        { id: '', name: 'Bhaskar R', department: 'Engineering', location: 'Bengaluru', status: 'Present', punchIn: '10:30', punchOut: '17:30' },
        { id: '', name: 'Ravi Kumar', department: 'Marketing', location: 'Bengaluru', status: 'Present', punchIn: '10:30', punchOut: '20:00' },
        { id: '', name: 'Ananya Sharma', department: 'Sales', location: 'Silchar', status: 'Absent', punchIn: null, punchOut: null },
        { id: '', name: 'Suresh Gupta', department: 'Engineering', location: 'Bengaluru', status: 'Present', punchIn: '10:30', punchOut: '20:00' },
        { id: '', name: 'Madhavi Reddy', department: 'Design', location: 'Remote', status: 'On Leave', punchIn: null, punchOut: null },
        { id: '', name: 'Amit Verma', department: 'Sales', location: 'Bengaluru', status: 'Present', punchIn: '10:30', punchOut: '20:00' },
        { id: '', name: 'Priya Patel', department: 'Engineering', location: 'Silchar', status: 'Half Day', punchIn: '10:30', punchOut: '16:30' },
        { id: '', name: 'Manoj Yadav', department: 'Marketing', location: 'Bengaluru', status: 'On Leave', punchIn: null, punchOut: null },
        { id: '', name: 'Vikram Singh', department: 'Sales', location: 'Silchar', status: 'Present', punchIn: '10:30', punchOut: '20:00' },
        { id: '', name: 'Neha Desai', department: 'Engineering', location: 'Bengaluru', status: 'Absent', punchIn: null, punchOut: null },
        { id: '', name: 'Arun K', department: 'Digital Marketing', location: 'Remote', status: 'Present', punchIn: '10:30', punchOut: '20:00' },
        { id: '', name: 'Aishwarya Iyer', department: 'Sales', location: 'Bengaluru', status: 'Present', punchIn: '10:30', punchOut: '20:00' },
        { id: '', name: 'Harish Kumar', department: 'SAP', location: 'Silchar', status: 'On Leave', punchIn: null, punchOut: null },
        { id: '', name: 'Kavya Gupta', department: 'Digital Marketing', location: 'Bengaluru', status: 'Absent', punchIn: null, punchOut: null },
        { id: '', name: 'Sandeep Prakash', department: 'Marketing', location: 'Remote', status: 'Present', punchIn: '10:30', punchOut: '20:00' },
        { id: '', name: 'Neeraj Singh', department: 'SAP', location: 'Bengaluru', status: 'Half Day', punchIn: '10:30', punchOut: '16:30' }
    ];



    const locations = ['Bengaluru', 'Silchar', 'Remote'];
    const departments = ['Engineering', 'Design', 'Marketing', 'Sales'];
    const statuses = ['Present', 'Absent', 'Half Day', 'On Leave'];

    const attendanceCounts = {
        present: mockEmployees.filter(emp => emp.status === 'Present').length,
        absent: mockEmployees.filter(emp => emp.status === 'Absent').length,
        halfDay: mockEmployees.filter(emp => emp.status === 'Half Day').length,
        onLeave: mockEmployees.filter(emp => emp.status === 'On Leave').length
    };

    const filteredEmployees = mockEmployees.filter(employee => {
        return (
            (!filters.location || employee.location === filters.location) &&
            (!filters.department || employee.department === filters.department) &&
            (!filters.status || employee.status === filters.status)
        );
    });

    const handleAttendanceUpdate = (e) => {
        e.preventDefault();
        setShowAttendanceModal(false);
    };

    const AttendanceModal = () => (
        <div className="daily-attendance__modal-overlay">
            <div className="daily-attendance__modal-content">
                <div className="daily-attendance__modal-header">
                    <h3>Update Attendance</h3>
                    <button onClick={() => setShowAttendanceModal(false)}>
                        <X className="daily-attendance__icon-close" />
                    </button>
                </div>

                {selectedEmployee && (
                    <form onSubmit={handleAttendanceUpdate} className="daily-attendance__form">
                        <div className="daily-attendance__employee-info">
                            <p>{selectedEmployee.name}</p>
                            <p>ID: {selectedEmployee.id}</p>
                            <p>Dept: {selectedEmployee.department}</p>
                        </div>

                        <div>
                            <label>Status</label>
                            <select defaultValue={selectedEmployee.status}>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Punch In Time</label>
                            <input type="time" defaultValue={selectedEmployee.punchIn || ''} />
                        </div>

                        <div>
                            <label>Punch Out Time</label>
                            <input type="time" defaultValue={selectedEmployee.punchOut || ''} />
                        </div>

                        <div className="daily-attendance__form-actions">
                            <button type="button" onClick={() => setShowAttendanceModal(false)}>Cancel</button>
                            <button type="submit">Update Attendance</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );

    return (
        <div className="daily-attendance__container">
            <div className="daily-attendance__header">
                <div className="daily-attendance__header-left">
                    {/* <ClipboardCheck className="daily-attendance__icon" /> */}
                    <h2>Daily Attendance</h2>
                    <p className="leave-subtitle">Track and review daily attendance records with ease</p>
                </div>
                <div className="daily-attendance__date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="daily-attendance__summary-grid">
                <div className="daily-attendance__summary-card present">
                    <p>Present</p>
                    <p className='ppp'>{attendanceCounts.present}</p>
                </div>
                <div className="daily-attendance__summary-card absent">
                    <p>Absent</p>
                    <p>{attendanceCounts.absent}</p>
                </div>
                <div className="daily-attendance__summary-card half-day">
                    <p>Half Day</p>
                    <p>{attendanceCounts.halfDay}</p>
                </div>
                <div className="daily-attendance__summary-card on-leave">
                    <p>On Leave</p>
                    <p>{attendanceCounts.onLeave}</p>
                </div>
            </div>

            <div className="daily-attendance__filters">
                <div>
                    <label>Location</label>
                    <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                        <option value="">All Locations</option>
                        {locations.map(location => <option key={location} value={location}>{location}</option>)}
                    </select>
                </div>

                <div>
                    <label>Department</label>
                    <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                        <option value="">All Departments</option>
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>

                <div>
                    <label>Status</label>
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                        <option value="">All Status</option>
                        {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>

            <div className="daily-attendance__table-container">
                <table className="daily-attendance__table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Punch In</th>
                            <th>Punch Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => (
                            <tr key={employee.id} onClick={() => { setSelectedEmployee(employee); setShowAttendanceModal(true); }}>
                                <td>{employee.name} <span>{employee.id}</span></td>
                                <td>{employee.department}</td>
                                <td>{employee.location}</td>
                                <td>
                                    <span className={`daily-attendance__status ${employee.status.toLowerCase().replace(' ', '-')}`}>
                                        {employee.status}
                                    </span>
                                </td>
                                <td>{employee.punchIn || '-'}</td>
                                <td>{employee.punchOut || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAttendanceModal && <AttendanceModal />}
        </div>
    );
};

export default DailyAttendance;
