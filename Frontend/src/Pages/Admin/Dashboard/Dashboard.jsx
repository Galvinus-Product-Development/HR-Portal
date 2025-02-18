import React from 'react';
import { format } from 'date-fns';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Cake,
    Bell,
    UserPlus,
    GraduationCap,
    CalendarClock,
    PartyPopper,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    // Mock data
    const dashboardStats = {
        totalEmployees: 35,
        employeesOnLeave: 8,
        pendingLeaveRequests: 5,
        upcomingBirthdays: 3
    };

    const notifications = [
        {
            id: 1,
            type: 'orientation',
            title: 'New Employee Orientation',
            message: 'Sarah Johnson is joining the Engineering team today',
            timestamp: '2024-03-15T09:00:00',
            icon: UserPlus,
            priority: 'high'
        },
        {
            id: 2,
            type: 'training',
            title: 'Training Completion',
            message: 'Mike Chen completed "Advanced React Development" course',
            timestamp: '2024-03-14T16:30:00',
            icon: GraduationCap,
            priority: 'normal'
        },
        {
            id: 3,
            type: 'leave',
            title: 'Leave Request',
            message: 'David Wilson requested annual leave for next week',
            timestamp: '2024-03-14T14:15:00',
            icon: CalendarClock,
            priority: 'normal'
        },
        {
            id: 4,
            type: 'event',
            title: 'Company Event',
            message: 'Annual Team Building Event scheduled for March 25th',
            timestamp: '2024-03-14T11:00:00',
            icon: PartyPopper,
            priority: 'normal'
        },
        {
            id: 5,
            type: 'alert',
            title: 'System Update',
            message: 'HR Portal will be under maintenance on Sunday, 2 AM - 4 AM',
            timestamp: '2024-03-14T10:00:00',
            icon: AlertCircle,
            priority: 'high'
        }
    ];

    // Mock pending leaves data
    const pendingLeaves = [
        {
            id: 'leave1',
            employee: {
                name: 'Subham Roy',
                department: 'Engineering',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
            },
            type: 'Annual Leave',
            startDate: '2024-03-20',
            endDate: '2024-03-25',
            duration: '5 days',
            reason: 'Family vacation',
            requestedOn: '2024-03-14T09:30:00'
        },
        {
            id: 'leave2',
            employee: {
                name: 'Salma Shirin',
                department: 'Marketing',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
            },
            type: 'Sick Leave',
            startDate: '2024-03-18',
            endDate: '2024-03-19',
            duration: '2 days',
            reason: 'Medical appointment',
            requestedOn: '2024-03-15T11:20:00'
        },
        {
            id: 'leave3',
            employee: {
                name: 'Bhaskar R',
                department: 'Design',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
            },
            type: 'Personal Leave',
            startDate: '2024-03-22',
            endDate: '2024-03-22',
            duration: '1 day',
            reason: 'Personal errands',
            requestedOn: '2024-03-15T14:45:00'
        }
    ];

    const getNotificationColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'notification-high';
            default:
                return 'notification-normal';
        }
    };

    const getLeaveTypeColor = (type) => {
        switch (type) {
            case 'Annual Leave':
                return 'leave-blue';
            case 'Sick Leave':
                return 'leave-red';
            case 'Personal Leave':
                return 'leave-purple';
            default:
                return 'leave-default';
        }
    };

    return (
        <div className="dashboard--container">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Admin Dashboard</h2>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-item">
                    <div>
                        <p className="stat-label">Total Employees</p>
                        <span className="stat-number">{dashboardStats.totalEmployees}</span>
                    </div>
                    <div className="stat-icon">
                        <Users className="icon" />
                    </div>
                </div>

                <div className="stat-item">
                    <div>
                        <p className="stat-label">On Leave Today</p>
                        <span className="stat-number">{dashboardStats.employeesOnLeave}</span>
                    </div>
                    <div className="stat-icon">
                        <Calendar className="icon" />
                    </div>
                </div>

                <div className="stat-item">
                    <div>
                        <p className="stat-label">Pending Leaves</p>
                        <span className="stat-number">{dashboardStats.pendingLeaveRequests}</span>
                    </div>
                    <div className="stat-icon">
                        <CalendarClock className="icon" />
                    </div>
                </div>

                <div className="stat-item">
                    <div>
                        <p className="stat-label">New Joinees</p>
                        <span className="stat-number">{dashboardStats.upcomingBirthdays}</span>
                    </div>
                    <div className="stat-icon">
                        <Cake className="icon" />
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Flex container for Notifications and Pending Leaves */}
                <div className="dashboard-flex-container">
                    {/* Notifications Section */}
                    <div className="notifications">
                        <h2 className="notifications-title">
                            <Bell className="notifications-icon" />
                            Notifications
                        </h2>
                        <div className="notification-list">
                            {notifications.map((notification) => (
                                <div key={notification.id} className={`notification-item ${getNotificationColor(notification.priority)}`}>
                                    <div className="notification-content">
                                        <div className="notification-icon">
                                            <notification.icon className="icon" />
                                        </div>
                                        <div className="notification-details">
                                            <h3 className="notification-title">{notification.title}</h3>
                                            <p className="notification-message">{notification.message}</p>
                                            <p className="notification-timestamp">
                                                {format(new Date(notification.timestamp), 'MMM d, yyyy • h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Leaves Section */}
                    <div className="pending-leaves">
                        <h2 className="pending-leaves-title">
                            <CalendarClock className="pending-leaves-icon" />
                            Pending Leave Requests
                        </h2>
                        <div className="pending-leaves-list">
                            {pendingLeaves.map((leave) => (
                                <div key={leave.id} className="pending-leave-item">
                                    <div className="leave-header">
                                        <img src={leave.employee.avatar} alt={leave.employee.name} className="employee-avatar" />
                                        <div className='kkkk'>
                                            <div className="leave-details">
                                                <h3 className="leave-employee-name">{leave.employee.name}</h3>
                                                <span className={`leave-type ${getLeaveTypeColor(leave.type)}`}>{leave.type}</span>
                                            </div>
                                            <div>
                                                <p className="leave-department">{leave.employee.department}</p>
                                                <p className="leave-duration">{leave.duration}</p>
                                                <p className="leave-dates">
                                                    {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                                                </p>
                                                <p className="leave-reason">{leave.reason}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="leave-footer">
                                        <span className="leave-requested-on">
                                            Requested {format(new Date(leave.requestedOn), 'MMM d, h:mm a')}
                                        </span>
                                        <div className="leave-actions">
                                            <button className="leave-action approve">
                                                <CheckCircle className="action-icon" />
                                            </button>
                                            <button className="leave-action reject">
                                                <XCircle className="action-icon" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
