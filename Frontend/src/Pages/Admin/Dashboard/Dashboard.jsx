// import React, { useEffect, useState } from 'react';
// import { format } from 'date-fns';
// import io from 'socket.io-client';
// import {
//     LayoutDashboard,
//     Users,
//     Calendar,
//     Cake,
//     Bell,
//     UserPlus,
//     GraduationCap,
//     CalendarClock,
//     PartyPopper,
//     AlertCircle,
//     CheckCircle,
//     XCircle
// } from 'lucide-react';
// import './Dashboard.css';

// const socket = io('http://localhost:5002'); // Adjust as per backend URL

// const Dashboard = () => {
// const [dashboardStats, setDashboardStats] = useState({
//     totalEmployees: 0,
//     employeesOnLeave: 0,
//     pendingLeaveRequests: 0,
//     upcomingBirthdays: 0
// });

// const [notifications, setNotifications] = useState([]);
// const [pendingLeaves, setPendingLeaves] = useState([]);
//     const userId = localStorage.getItem("userId");

// useEffect(() => {
//     // Fetch dashboard stats

//     // const fetchDashboardStats = async () => {
//     //     try {
//     //         const response = await fetch('http://localhost:5002/api/dashboard/stats');
//     //         if (!response.ok) throw new Error('Failed to fetch dashboard stats');
//     //         const data = await response.json();
//     //         setDashboardStats(data);
//     //     } catch (error) {
//     //         console.error('Error fetching dashboard stats:', error);
//     //     }
//     // };

//     // Fetch past notifications
//     const fetchNotifications = async () => {
//         console.log("We are here...")
//         try {
//             const response = await fetch(`http://localhost:5002/api/notifications/${userId}`);
//             if (!response.ok) throw new Error('Failed to fetch notifications');

//             const data = await response.json();
//             console.log(data);
//             setNotifications(data);
//         } catch (error) {
//             console.error('Error fetching notifications:', error);
//         }
//     };

//     // Fetch pending leave requests

//     // const fetchPendingLeaves = async () => {
//     //     try {
//     //         const response = await fetch('http://localhost:5002/api/leaves/pending');
//     //         if (!response.ok) throw new Error('Failed to fetch pending leaves');
//     //         const data = await response.json();
//     //         setPendingLeaves(data);
//     //     } catch (error) {
//     //         console.error('Error fetching pending leaves:', error);
//     //     }
//     // };

//     // fetchDashboardStats();
//     fetchNotifications();
//     // fetchPendingLeaves();

//     // Join user-specific WebSocket room
//     socket.emit('join', userId);

//     // Listen for new notifications
//     socket.on('notification', (notification) => {
//         console.log('New Notification:', notification);
//         setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//         socket.off('notification'); // Cleanup WebSocket listener
//     };
// }, [userId]);

//     // Function to determine notification color
//     const getNotificationColor = (priority) => {
//         return priority === 'high' ? 'notification-high' : 'notification-normal';
//     };

//     // Function to determine leave type color
//     const getLeaveTypeColor = (type) => {
//         switch (type) {
//             case 'Annual Leave': return 'leave-blue';
//             case 'Sick Leave': return 'leave-red';
//             case 'Personal Leave': return 'leave-purple';
//             default: return 'leave-default';
//         }
//     };

//     return (
//         <div className="dashboard--container">
//             <div className="dashboard-header">
//                 <h2 className="dashboard-title">Admin Dashboard</h2>
//             </div>

//             {/* Stats Cards */}
//             <div className="dashboard-stats">
//                 <div className="stat-item">
//                     <div>
//                         <p className="stat-label">Total Employees</p>
//                         <span className="stat-number">{dashboardStats.totalEmployees}</span>
//                     </div>
//                     <div className="stat-icon">
//                         <Users className="icon" />
//                     </div>
//                 </div>

//                 <div className="stat-item">
//                     <div>
//                         <p className="stat-label">On Leave Today</p>
//                         <span className="stat-number">{dashboardStats.employeesOnLeave}</span>
//                     </div>
//                     <div className="stat-icon">
//                         <Calendar className="icon" />
//                     </div>
//                 </div>

//                 <div className="stat-item">
//                     <div>
//                         <p className="stat-label">Pending Leaves</p>
//                         <span className="stat-number">{dashboardStats.pendingLeaveRequests}</span>
//                     </div>
//                     <div className="stat-icon">
//                         <CalendarClock className="icon" />
//                     </div>
//                 </div>

//                 <div className="stat-item">
//                     <div>
//                         <p className="stat-label">New Joinees</p>
//                         <span className="stat-number">{dashboardStats.upcomingBirthdays}</span>
//                     </div>
//                     <div className="stat-icon">
//                         <Cake className="icon" />
//                     </div>
//                 </div>
//             </div>

//             {/* Notifications Section */}
//             <div className="notifications">
//                 <h2 className="notifications-title">
//                     <Bell className="notifications-icon" />
//                     Notifications
//                 </h2>
//                 <div className="notification-list">
//                     {notifications.length > 0 ? (
//                         notifications.map((notification) => (
//                             <div key={notification._id} className={`notification-item ${getNotificationColor(notification.priority)}`}>
//                                 <div className="notification-content">
//                                     <div className="notification-icon">
//                                         {notification.type === 'orientation' && <UserPlus className="icon" />}
//                                         {notification.type === 'training' && <GraduationCap className="icon" />}
//                                         {notification.type === 'leave' && <CalendarClock className="icon" />}
//                                         {notification.type === 'event' && <PartyPopper className="icon" />}
//                                         {notification.type === 'alert' && <AlertCircle className="icon" />}
//                                     </div>
//                                     <div className="notification-details">
//                                         <h3 className="notification-title">{notification.title}</h3>
//                                         <p className="notification-message">{notification.message}</p>
//                                         <p className="notification-timestamp">
//                                             {format(new Date(notification.createdAt), 'MMM d, yyyy • h:mm a')}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="no-notifications">No new notifications</p>
//                     )}
//                 </div>
//             </div>

//             {/* Pending Leave Requests */}
//             <div className="pending-leaves">
//                 <h2 className="pending-leaves-title">
//                     <CalendarClock className="pending-leaves-icon" />
//                     Pending Leave Requests
//                 </h2>
//                 <div className="pending-leaves-list">
//                     {pendingLeaves.length > 0 ? (
//                         pendingLeaves.map((leave) => (
//                             <div key={leave._id} className="pending-leave-item">
//                                 <div className="leave-header">
//                                     <img src={leave.employee.avatar} alt={leave.employee.name} className="employee-avatar" />
//                                     <div>
//                                         <div className="leave-details">
//                                             <h3 className="leave-employee-name">{leave.employee.name}</h3>
//                                             <span className={`leave-type ${getLeaveTypeColor(leave.type)}`}>{leave.type}</span>
//                                         </div>
//                                         <div>
//                                             <p className="leave-department">{leave.employee.department}</p>
//                                             <p className="leave-duration">{leave.duration}</p>
//                                             <p className="leave-dates">
//                                                 {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
//                                             </p>
//                                             <p className="leave-reason">{leave.reason}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="no-pending-leaves">No pending leave requests</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
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
  XCircle,
  User,
} from "lucide-react";
import io from 'socket.io-client';
import "./Dashboard.css";

const socket = io(`${import.meta.env.VITE_SOCKET_URL}`);
const API_BASE_URL_NS = `${import.meta.env.VITE_API_BASE_URL_NS}`;

const Dashboard = () => {
  // Mock data
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    employeesOnLeave: 0,
    pendingLeaveRequests: 0,
    upcomingBirthdays: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const userId = localStorage.getItem("userId");

  // Mock notifications data

  // Mock pending leaves data
  useEffect(() => {
    // Fetch dashboard stats

    // const fetchDashboardStats = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5002/api/dashboard/stats');
    //         if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    //         const data = await response.json();
    //         setDashboardStats(data);
    //     } catch (error) {
    //         console.error('Error fetching dashboard stats:', error);
    //     }
    // };

    // Fetch past notifications
    const fetchNotifications = async () => {
      console.log("We are here...");
      try {
        const response = await fetch(
          `${API_BASE_URL_NS}/api/notifications/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        console.log(data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch pending leave requests

    // const fetchPendingLeaves = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5002/api/leaves/pending');
    //         if (!response.ok) throw new Error('Failed to fetch pending leaves');
    //         const data = await response.json();
    //         setPendingLeaves(data);
    //     } catch (error) {
    //         console.error('Error fetching pending leaves:', error);
    //     }
    // };

    // fetchDashboardStats();
    fetchNotifications();
    // fetchPendingLeaves();

    // Join user-specific WebSocket room
    socket.emit("join", userId);

    // Listen for new notifications
    socket.on("notification", (notification) => {
      console.log("New Notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification"); // Cleanup WebSocket listener
    };
  }, [userId]);

  const getNotificationColor = (priority) => {
    switch (priority) {
      case "high":
        return "dashboard__notification-high";
      default:
        return "dashboard__notification-normal";
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Annual Leave":
        return "dashboard__leave-annual";
      case "Sick Leave":
        return "dashboard__leave-sick";
      case "Personal Leave":
        return "dashboard__leave-personal";
      default:
        return "dashboard__leave-default";
    }
  };

  return (
    <div className="dashboard__container">
      <div className="dashboard__header">
        <LayoutDashboard className="dashboard__header-icon" />
        <h1 className="dashboard__header-title">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="dashboard__stats-grid">
        <div className="dashboard__stats-card">
          <div className="dashboard__stats-card-content">
            <div>
              <p className="dashboard__stats-label">Total Employees</p>
              <p className="dashboard__stats-value">
                {dashboardStats.totalEmployees}
              </p>
            </div>
            <div className="dashboard__stats-icon-container dashboard__stats-icon-blue">
              <Users className="dashboard__stats-icon" />
            </div>
          </div>
        </div>

        <div className="dashboard__stats-card">
          <div className="dashboard__stats-card-content">
            <div>
              <p className="dashboard__stats-label">On Leave Today</p>
              <p className="dashboard__stats-value">
                {dashboardStats.employeesOnLeave}
              </p>
            </div>
            <div className="dashboard__stats-icon-container dashboard__stats-icon-green">
              <Calendar className="dashboard__stats-icon" />
            </div>
          </div>
        </div>

        <div className="dashboard__stats-card">
          <div className="dashboard__stats-card-content">
            <div>
              <p className="dashboard__stats-label">Pending Leaves</p>
              <p className="dashboard__stats-value">
                {dashboardStats.pendingLeaveRequests}
              </p>
            </div>
            <div className="dashboard__stats-icon-container dashboard__stats-icon-yellow">
              <CalendarClock className="dashboard__stats-icon" />
            </div>
          </div>
        </div>

        <div className="dashboard__stats-card">
          <div className="dashboard__stats-card-content">
            <div>
              <p className="dashboard__stats-label">Active Employees</p>
              <p className="dashboard__stats-value">
                {dashboardStats.upcomingBirthdays}
              </p>
            </div>
            <div className="dashboard__stats-icon-container dashboard__stats-icon-purple">
              <User className="dashboard__stats-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__main-grid">
        {/* Notifications Section */}
        <div className="dashboard__notifications-container">
          <div className="dashboard__card">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">
                <Bell className="dashboard__section-icon" />
                Notifications
              </h2>
              <span className="dashboard__notification-count">
                {notifications.length} new notifications
              </span>
            </div>
            <div className="dashboard__notifications-list">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`dashboard__notification-item ${getNotificationColor(
                      notification.priority
                    )}`}
                  >
                    <div className="dashboard__notification-content">
                      <div
                        className={`dashboard__notification-icon ${
                          notification.priority === "high"
                            ? "dashboard__notification-icon-high"
                            : "dashboard__notification-icon-normal"
                        }`}
                      >
                        <notification.icon className="dashboard__icon-small" />
                      </div>
                      <div className="dashboard__notification-text">
                        <h3 className="dashboard__notification-title">
                          {notification.title}
                        </h3>
                        <p className="dashboard__notification-message">
                          {notification.message}
                        </p>
                        <p className="dashboard__notification-timestamp">
                          {format(
                            new Date(notification.createdAt),
                            "MMM d, yyyy • h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-notifications">No new notifications</p>
              )}
            </div>
          </div>
        </div>

        {/* Pending Leaves Section */}
        <div className="dashboard__leaves-container">
          <div className="dashboard___card">
            <h2 className="dashboard__section-title">
              <CalendarClock className="dashboard__section-icon" />
              Pending Leave Requests
            </h2>
            <div className="dashboard__leaves-list">
              {pendingLeaves.length > 0 ? (
                pendingLeaves.map((leave) => (
                  <div key={leave.id} className="dashboard__leave-item">
                    <div className="dashboard__leave-content">
                      <img
                        src={leave.employee.avatar}
                        alt={leave.employee.name}
                        className="dashboard__leave-avatar"
                      />
                      <div className="dashboard__leave-details">
                        <div className="dashboard__leave-header">
                          <h3 className="dashboard__leave-employee">
                            {leave.employee.name}
                          </h3>
                          <span
                            className={`dashboard__leave-type ${getLeaveTypeColor(
                              leave.type
                            )}`}
                          >
                            {leave.type}
                          </span>
                        </div>
                        <p className="dashboard__leave-department">
                          {leave.employee.department}
                        </p>
                        <div className="dashboard__leave-dates">
                          <p className="dashboard__leave-duration">
                            <Clock className="dashboard__icon-tiny" />
                            {leave.duration}
                          </p>
                          <p className="dashboard__leave-period">
                            <Calendar className="dashboard__icon-tiny" />
                            {format(new Date(leave.startDate), "MMM d")} -{" "}
                            {format(new Date(leave.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        <p className="dashboard__leave-reason">
                          {leave.reason}
                        </p>
                        <div className="dashboard__leave-footer">
                          <p className="dashboard__leave-requested">
                            Requested{" "}
                            {format(
                              new Date(leave?.requestedOn),
                              "MMM d, h:mm a"
                            )}
                          </p>
                          <div className="dashboard__leave-actions">
                            <button className="dashboard__leave-action-approve">
                              <CheckCircle className="dashboard__icon-action" />
                            </button>
                            <button className="dashboard__leave-action-reject">
                              <XCircle className="dashboard__icon-action" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-pending-leaves">No pending leave requests</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
