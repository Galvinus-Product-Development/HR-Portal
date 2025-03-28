import React, { useEffect, useState } from "react";
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
import io from "socket.io-client";
import "./Dashboard.css";
const token = localStorage.getItem("accessToken");
const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
  path: "/ns/socket.io", 
  transports: ["websocket", "polling"], 
  auth: {
    token, // ✅ Send token for authentication
  },
});
const API_BASE_URL_NS = `${import.meta.env.VITE_API_BASE_URL_NS}`;
const API_BASE_URL_LM = `${import.meta.env.VITE_API_BASE_URL_LM}`;

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
    console.log(socket.connected ? "✅ Connected" : "❌ Not Connected");
    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL_NS}/api/notifications/dashboard-stats`);
            if (!response.ok) throw new Error('Failed to fetch dashboard stats');
            const data = await response.json();
            console.log("stats data:------------------------",data)
            setDashboardStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    // Fetch past notifications
    const fetchNotifications = async () => {
      console.log("We are here...");
      try {
        const response = await fetch(
          `${API_BASE_URL_NS}/api/notifications/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        console.log("this is the notification data",data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch pending leave requests

    const fetchPendingLeaves = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL_LM}/api/leave-requests/pending/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch pending leaves");
        const data = await response.json();
        console.log("this is the pending leaves",data)
        setPendingLeaves(data);
      } catch (error) {
        console.error("Error fetching pending leaves:", error);
      }
    };

    fetchDashboardStats();
    fetchNotifications();
    fetchPendingLeaves();

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

  const markAsRead = async (id) => {
    try {
      await fetch(
        `${API_BASE_URL_NS}/api/notifications/${id}/read`, { method: "PATCH" });

      // Update UI Optimistically
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, status: "READ" }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
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
                {dashboardStats?.totalEmployees}
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
                {dashboardStats?.onLeaveToday}
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
                {dashboardStats?.pendingLeaves}
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
                {dashboardStats?.activeEmployees}
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
                        {notification.icon && (
                          <notification.icon className="dashboard__icon-small" />
                        )}
                        <Bell className="dashboard__icon-small" />
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
                    {/* "Mark as Read" button */}
                    {notification.status === "UNREAD" && (
                      <button
                        className="dashboard__notification-mark-read"
                        onClick={() =>{ 
                          console.log("this is notification id:-",notification);
                          markAsRead(notification.id)}}
                      >
                        Mark as Read
                      </button>
                    )}
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
                pendingLeaves?.map((leave) => (
                  <div key={leave.id} className="dashboard__leave-item">
                    <div className="dashboard__leave-content">
                      <img
                        src={leave?.employee?.avatar}
                        alt={leave?.name}
                        className="dashboard__leave-avatar"
                      />
                      <div className="dashboard__leave-details">
                        <div className="dashboard__leave-header">
                          <h3 className="dashboard__leave-employee">
                            {leave?.name}
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
                          {leave?.department}
                        </p>
                        <div className="dashboard__leave-dates">
                          <p className="dashboard__leave-duration">
                            <Clock className="dashboard__icon-tiny" />
                            {leave?.duration}
                          </p>
                          <p className="dashboard__leave-period">
                            <Calendar className="dashboard__icon-tiny" />
                            {format(new Date(leave.startDate), "MMM d")} -{" "}
                            {format(new Date(leave.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        <p className="dashboard__leave-reason">
                          {leave?.reason}
                        </p>
                        <div className="dashboard__leave-footer">
                          <p className="dashboard__leave-requested">
                            Requested{" "}
                            {format(
                              new Date(leave?.appliedOn),
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
                          {/* {notification.status === "UNREAD" && (
                            <button
                              className="dashboard__notification-mark-read"
                              onClick={() => markAsRead(notification._id)}
                            >
                              Mark as Read
                            </button>
                          )} */}
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
