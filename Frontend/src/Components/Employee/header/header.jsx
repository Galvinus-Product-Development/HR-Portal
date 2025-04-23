import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, User, Upload, LayoutDashboard, X, UserRound } from "lucide-react";

import "./Header.css";
import gal_logo from "../../../assets/gal_logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContexts";
import axios from "axios";
import { format } from "date-fns";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
const API_BASE_URL_NS = `${import.meta.env.VITE_API_BASE_URL_NS}`;

const Header = ({ pendingRequests }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  );
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem("profilePicture") || null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const handleEmployeeRoute = (e) => {
    console.log("Here why I am not able to move to the employee dashboard")
    navigate("/admin");
  }
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const fetchNotifications = async () => {
    console.log("We are here...");
    try {
      const response = await fetch(
        `${API_BASE_URL_NS}/api/notifications/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      console.log("this is the notification data", data);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL_NS}/api/notifications/mark-read/${notificationId}`,
        {
          method: 'PUT',
        }
      );
      if (!response.ok) throw new Error("Failed to mark notification as read");
      
      // Update local state to reflect the change
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? {...notification, status: 'READ'} 
          : notification
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case "high":
        return "dashboard__notification-high";
      case "medium":
        return "dashboard__notification-medium";
      default:
        return "dashboard__notification-normal";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("userId", userId);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/upload-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.imageUrl) {
        const cacheBustedUrl = `${response.data.imageUrl}?t=${new Date().getTime()}`;
        setProfileImage(cacheBustedUrl);
        localStorage.setItem("profileImage", cacheBustedUrl);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications on component mount
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  return (
    <header className="unique-navbar-container">
      <div className="unique-navbar-header">
        <img src={gal_logo} className="unique-navbar-logo" alt="Galvinus Logo" />
        <span className="unique-navbar-title">Galvinus Employee Portal</span>
      </div>

      <div className="unique-navbar-right">
        <div className="unique-navbar-icons">
          <div className="unique-navbar-notification-container" ref={notificationRef}>
            <button 
              className="unique-navbar-notifications" 
              onClick={toggleNotifications}
            >
              <Bell className="unique-navbar-bell-icon" />
              {notifications.filter(n => n.status === "UNREAD").length > 0 && (
                <span className="unique-notification-badge">
                  {notifications.filter(n => n.status === "UNREAD").length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3 className="notification-title">Notifications</h3>
                  <span className="notification-count">
                    {notifications.filter(n => n.status === "UNREAD").length} new
                  </span>
                </div>
                
                <div className="notification-divider" />
                
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${getNotificationColor(notification.priority)}`}
                        onClick={() => {
                          if (notification.redirectUrl) {
                            window.open(notification.redirectUrl, "_blank")
                          }
                        }}
                      >
                        <div className="notification-content">
                          <div className={`notification-icon ${
                            notification.priority === "high"
                              ? "notification-icon-high"
                              : "notification-icon-normal"
                          }`}>
                            <Bell className="notification-icon-small" />
                          </div>
                          <div className="notification-text">
                            <h3 className="notification-item-title">
                              {notification.title}
                            </h3>
                            <p className="notification-message">
                              {notification.message}
                            </p>
                            <p className="notification-timestamp">
                              {format(
                                new Date(notification.createdAt),
                                "MMM d, yyyy • h:mm a"
                              )}
                            </p>
                          </div>
                        </div>
                        {notification.status === "UNREAD" && (
                          <button
                            className="notification-mark-read"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="notification-footer">
                    {/* <button 
                      className="notification-view-all"
                      onClick={() => navigate("/")}
                    >
                    </button> */}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="unique-navbar-profile-container" ref={profileRef}>
          <div className="unique-navbar-profile"  onClick={toggleDropdown}>
            <img
              src={profileImage}
              alt="Admin"
              className="unique-navbar-profile-pic"
            />
          </div>












          {showDropdown && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    <User size={40} className="profile-avatar-placeholder" />
                  )}
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">
                    {localStorage.getItem("name") || "User"}
                  </h3>
                  <span className="profile-role">
                    {localStorage.getItem("user") || "Employee"}
                  </span>
                  <span className="profile-email">
                    {localStorage.getItem("email") || "user@example.com"}
                  </span>
                </div>
              </div>

              <div className="profile-divider"></div>

              <div className="profile-upload-section">
                <label
                  htmlFor="profile-upload"
                  className="profile-upload-label"
                >
                  <Upload size={18} className="profile-upload-icon" />
                  <span>Change Profile Picture</span>
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="profile-upload-input"
                />
                {selectedFile && (
                  <div className="profile-upload-preview">
                    <div className="profile-preview-header">
                      <span className="profile-preview-title">
                        Selected Image
                      </span>
                      <button
                        className="profile-preview-cancel"
                        onClick={() => setSelectedFile(null)}
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="profile-preview-image"
                    />
                    <div className="profile-preview-actions">
                      <button
                        className="profile-upload-button profile-upload-cancel"
                        onClick={() => setSelectedFile(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="profile-upload-button profile-upload-confirm"
                        onClick={handleUpload}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-divider"></div>

              <div className="profile-actions">
                <button
                  onClick={handleEmployeeRoute}
                  className="profile-action-button"
                >
                  <LayoutDashboard size={18} className="profile-action-icon" />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="profile-action-button profile-logout"
                >
                  <LogOut size={18} className="profile-action-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;