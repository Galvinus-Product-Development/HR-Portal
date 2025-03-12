import React, { useState, useEffect } from 'react';
import './NotificationPage.css';


const API_BASE_URL_NS = import.meta.env.VITE_API_BASE_URL_NS;

console.log("Ns base url:-",API_BASE_URL_NS);
const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
console.log("Ed base url:-", API_BASE_URL_ED);
const NotificationPage = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [notification, setNotification] = useState({
        title: '',
        message: '',
        priority: 'NORMAL'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch employees from backend
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoadingEmployees(true);
            try {
                const response = await fetch(`${API_BASE_URL_ED}/api/employeeRoutes/formatted`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                setEmployees(data.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching employees:', err);
            } finally {
                setLoadingEmployees(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotification({ ...notification, [name]: value });
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(emp => emp.id));
        }
    };

    const handleEmployeeSelect = (empId) => {
        if (selectedEmployees.includes(empId)) {
            setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
        } else {
            setSelectedEmployees([...selectedEmployees, empId]);
        }
    };

    const handleFilterByDepartment = (dept) => {
        if (dept === 'All') return employees;
        return employees.filter(emp => emp.department === dept);
    };

    const sendNotification = async () => {
        if (selectedEmployees.length === 0) {
            setError('Please select at least one employee');
            return;
        }
    
        if (!notification.title.trim() || !notification.message.trim()) {
            setError('Title and message are required');
            return;
        }
    
        setIsLoading(true);
        setError('');
        console.log("Selected Employees:", JSON.stringify(selectedEmployees));
        try {
            const response = await fetch(`${API_BASE_URL_NS}/api/notifications`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userIds: selectedEmployees, // 🔹 Changed from `recipients` to `userIds`
                    type: "MANUAL", // 🔹 Added missing `type` field (update if needed)
                    title: notification.title,
                    message: notification.message,
                    priority: notification.priority
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to send notification');
            }
    
            setSuccessMessage('Notification sent successfully!');
            setNotification({ title: '', message: '', priority: 'NORMAL' });
            setSelectedEmployees([]);
    
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
            console.error('Error sending notification:', err);
        } finally {
            setIsLoading(false);
        }
    };
    

    const uniqueDepartments = ['All', ...new Set(employees.map(emp => emp.department))];
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const filteredEmployees = handleFilterByDepartment(selectedDepartment);

    return (
        <div className="notification-page">
            <div className="notification-header">
                <h1>Send Notifications</h1>
                <p>Compose and send notifications to employees</p>
            </div>

            <div className="notification-container">
                <div className="notification-form-section">
                    <h2>Notification Details</h2>
                    <div className="notification-form">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={notification.title}
                                onChange={handleInputChange}
                                placeholder="Enter notification title"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={notification.message}
                                onChange={handleInputChange}
                                placeholder="Enter your message here"
                                rows="5"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={notification.priority}
                                onChange={handleInputChange}
                            >
                                <option value="LOW">Low</option>
                                <option value="NORMAL">Normal</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="recipients-section">
                    <div className="recipients-header">
                        <h2>Select Recipients</h2>
                        <div className="filter-controls">
                            <div className="department-filter">
                                <label htmlFor="department">Department:</label>
                                <select
                                    id="department"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                >
                                    {uniqueDepartments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                className="select-all-btn"
                                onClick={handleSelectAll}
                            >
                                {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                    </div>

                    {loadingEmployees ? (
                        <p>Loading employees...</p>
                    ) : (
                        <div className="employees-list">
                            {filteredEmployees.map(employee => (
                                <div
                                    key={employee.id}
                                    className={`employee-item ${selectedEmployees.includes(employee.id) ? 'selected' : ''}`}
                                    onClick={() => handleEmployeeSelect(employee.id)}
                                >
                                    <div className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(employee.id)}
                                            readOnly
                                        />
                                    </div>
                                    <div className="employee-info">
                                        <div className="employee-name">{employee.name}</div>
                                        <div className="employee-detail">{employee.department} • {employee.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="notification-actions">
                <div className="selected-count">
                    Selected: <span>{selectedEmployees.length}</span> employees
                </div>
                <button
                    className={`send-btn ${isLoading ? 'loading' : ''}`}
                    onClick={sendNotification}
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send Notification'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default NotificationPage;
