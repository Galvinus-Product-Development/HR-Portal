import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Timer,
  Calendar,
  Users,
  Building,
  Bell,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const VITE_API_BASE_URL_NS = import.meta.env.VITE_API_BASE_URL_NS;
const VITE_API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
import io from "socket.io-client";
import "./Dashboard.css";
const token = localStorage.getItem("accessToken");
const socket = io(`${VITE_SOCKET_URL}`, {
  path: "/ns/socket.io", 
  transports: ["websocket", "polling"], 
  auth: {
    token, // ✅ Send token for authentication
  },
});
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workTimer, setWorkTimer] = useState("0:00:00");
  const [notifications, setNotifications] = useState([]);
  //   const [employeeId, setEmployeeId] = useState("67b71d3c7960559f9b7bd5c1"); // This should come from auth context in a real app. Change the employee ID dynamically here.
  const [todayStats, setTodayStats] = useState({
    lateComing: 0,
    overtime: 0,
  });
  // State to control visibility of time stats alert
  const [showTimeStats, setShowTimeStats] = useState(false);
  // New state to control the visibility of the checkout confirmation modal
  const [showModal, setShowModal] = useState(false);

  const employeeId = localStorage.getItem("userId"); // Storing the employee ID in local storage
  const userId = localStorage.getItem("userId");
  // This useEffect will hide the stats after 3 seconds whenever showTimeStats becomes true
  const ISTOffsetMs = 5.5 * 60 * 60 * 1000;

  const isCheckedInToday = () => {
    if (!checkInTime) return false;
    const checkInDate = new Date(checkInTime);
    const today = new Date();
    return (
      checkInDate.getFullYear() === today.getFullYear() &&
      checkInDate.getMonth() === today.getMonth() &&
      checkInDate.getDate() === today.getDate()
    );
  };

  // This optional effect will ensure that once a new day starts, the app resets and enables the Check In button again.
  useEffect(() => {
    const timer = setInterval(() => {
      const today = new Date();
      // If checkInTime exists, and it's not today, reset it.
      if (checkInTime) {
        const checkInDate = new Date(checkInTime);
        if (
          checkInDate.getFullYear() !== today.getFullYear() ||
          checkInDate.getMonth() !== today.getMonth() ||
          checkInDate.getDate() !== today.getDate()
        ) {
          setCheckInTime(null);
        }
      }
    }, 60000); // check every minute

    return () => clearInterval(timer);
  }, [checkInTime]);

  // This useEffect will hide the stats after 3 seconds whenever showTimeStats becomes true
  useEffect(() => {
    if (showTimeStats) {
      const timer = setTimeout(() => {
        setShowTimeStats(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showTimeStats]);

  // Fetch today's attendance on mount
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer1 = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer1);
  }, []);

  // Update work timer if checked in
  useEffect(() => {
    let timer;

    const checkedInTime = localStorage.getItem("checkInTime");

    if (checkedInTime) {
      setIsCheckedIn(true);

      // Convert to IST 12-hour format
      const check = convertToIST12HourFormat(checkedInTime);
      setCheckInTime(check);
      setWorkTimer(check);

      // 🔥 Clear existing interval before setting a new one
      if (window.workTimerInterval) {
        clearInterval(window.workTimerInterval);
      }

      timer = setInterval(() => {
        const start = new Date(checkedInTime).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setWorkTimer(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }, 1000);

      // Store interval globally
      console.log("Setting interval", timer);
      window.workTimerInterval = timer;
    }

    return () => {
      // Cleanup interval on component unmount or state change
      clearInterval(timer);
    };
  }, [isCheckedIn]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${VITE_API_BASE_URL_NS}/api/notifications/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        console.log(data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Join WebSocket room for real-time notifications
    socket.emit("join", userId);

    socket.on("notification", (notification) => {
      console.log("New Notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification"); // Cleanup listener on unmount
    };
  }, [userId]);

  // Fetch today's attendance record
  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL_AT}/api/attendance/${employeeId}/today`
      );

      if (!response.ok) {
        if (response.status === 404) {
          // No attendance record found for today, that's ok
          return;
        }
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();

      if (data) {
        // Update stats
        setTodayStats({
          lateComing: data.lateComing || 0,
          overtime: data.overtime || 0,
        });

        if (data.punchInTime) {
          // If already checked out, just set checked out status
          if (data.punchOutTime) {
            setIsCheckedIn(false);
            // Reset work timer to 0 instead of showing total time
            setWorkTimer("00:00:00");
          } else {
            // If still checked in, set check-in time and status
            setIsCheckedIn(true);
            setCheckInTime(data.punchInTime);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  function convertToIST12HourFormat(isoString) {
    const date = new Date(isoString);

    // Convert to IST (UTC +5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    let hours = istDate.getUTCHours();
    const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(istDate.getUTCSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  const handleWorkTimer = (startTime) => {
    if (window.workTimerInterval) {
      clearInterval(window.workTimerInterval);
    }

    window.workTimerInterval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - startTime;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setWorkTimer(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
  };

  // Handle Check In: create a new attendance record
  const handleCheckIn = async () => {
    if (!isCheckedIn) {
      if (window.workTimerInterval) {
        clearInterval(window.workTimerInterval);
      }
      const now = new Date();
      setCheckInTime(now.toISOString());
      setIsCheckedIn(true);
      try {
        const dailyAttendanceResponse = await fetch(
          `${VITE_API_BASE_URL_AT}/api/attendance`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              employeeId: employeeId,
              date: now.toISOString(),
              punchInTime: now.toISOString(),
              attendanceStatus: "Present",
              punchInMethod: "Dashboard",
            }),
          }
        );

        if (!dailyAttendanceResponse.ok) {
          throw new Error("Failed to check in");
        }

        const dateNow = new Date();
        const year = dateNow.getUTCFullYear();
        const month = dateNow.getMonth() + 1;
        const day = dateNow.getDate();
        const monthlyAttendanceResponse = await fetch(
          `${VITE_API_BASE_URL_AT}/api/monthlyAttendance/${employeeId}?year=${year}&month=${month}&day=${day}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // Send an empty object if no body is required
          }
        );

        if (!monthlyAttendanceResponse.ok) {
          throw new Error("Failed to save monthly attendance");
        }

        // Get updated record to see if we were late
        const data = await dailyAttendanceResponse.json();
        const istTime = new Date(now.getTime() + ISTOffsetMs); // Convert to IST

        const istISOString = new Date(
          istTime.getTime() - istTime.getTimezoneOffset() * 60000
        ).toISOString();

        // Extract IST hours, minutes, and seconds
        let hours = istTime.getUTCHours();
        const minutes = String(istTime.getUTCMinutes()).padStart(2, "0");
        const seconds = String(istTime.getUTCSeconds()).padStart(2, "0");

        // Convert to 12-hour format
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert '0' to '12'

        // Final formatted IST time in 12-hour format
        const ist12HourTimeString = `${hours}:${minutes} ${ampm}`;
        const ist12HourWorkTimer = `${hours}:${minutes}:${seconds} ${ampm}`;

        localStorage.setItem("checkInTime", now.toISOString());
        // localStorage.setItem("workTimer", ist12HourWorkTimer);
        const checkInTime123 = convertToIST12HourFormat(now.toISOString());
        setCheckInTime(checkInTime123);
        setWorkTimer("00:00:00");
        handleWorkTimer(now.getTime());

        setTodayStats({
          lateComing: data.lateComing || 0,
          overtime: data.overtime || 0,
        });

        // Show the time stats alert
        setShowTimeStats(true);

        // Update notifications
        const newNotification = {
          id: Date.now(),
          title: `Checked in at ${now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          time: "Just now",
          type: "success",
        };
        setNotifications((prev) => [newNotification, ...prev.slice(0, 5)]);
      } catch (error) {
        console.error("Check-in error:", error);
        setIsCheckedIn(false);
        setCheckInTime(null);
      }
    }
  };

  const handleCheckOut = async () => {
    if (isCheckedIn) {
      const now = new Date();
      console.log(now.toISOString());

      try {
        const dailyAttendanceResponse = await fetch(
          `${VITE_API_BASE_URL_AT}/api/attendance/${employeeId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              punchOutTime: now.toISOString(),
              punchOutMethod: "Dashboard",
            }),
          }
        );

        if (!dailyAttendanceResponse.ok) {
          throw new Error("Failed to check out");
        }

        setIsCheckedIn(false);
        setCheckInTime(null);
        clearInterval(window.workTimerInterval);
        window.workTimerInterval = null;
        setWorkTimer("00:00:00");
        localStorage.removeItem("checkInTime");

        // 🔥 Clear the interval on checkout

        // Update notifications
        const newNotification = {
          id: Date.now(),
          title: `Checked out at ${now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          time: "Just now",
          type: "info",
        };
        setNotifications((prev) => [newNotification, ...prev.slice(0, 5)]);
      } catch (error) {
        console.error("Check-out error:", error);
      }
    }
  };

  // Confirm Check Out: runs when the user confirms via the modal
  const confirmCheckOut = () => {
    setShowModal(false);
    handleCheckOut();
  };

  // Format minutes to a readable string
  const formatMinutes = (minutes) => {
    if (!minutes) return "0 mins";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + "m" : ""}`;
    }
    return `${mins}m`;
  };
  const username = localStorage.getItem("name") || generateDeviceId();

  const markAsRead = async (id) => {
    try {
      await fetch(`${VITE_API_BASE_URL_NS}/api/notifications/${id}/read`, {
        method: "PATCH",
      });

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
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <header>
          <h1 className="welcome-title">Welcome back, {username}!</h1>
          <p className="welcome-subtitle">Here's your HR dashboard overview</p>
        </header>
        <div className="current-time">
          <div className="current-time-text">
            <p className="time-label">Today's Date</p>
            <p className="time-value">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Clock className="current-time-icon" />
        </div>
      </div>

      {/* Check In/Out Section */}
      <div className="checkin-section">
        <div className="checkin-header">
          <div>
            <h2 className="checkin-title">Time Tracking</h2>
            <p className="checkin-time">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
          <Timer className="checkin-icon" />
        </div>

        <div className="checkin-stats">
          <div className="checkin-stat">
            <p className="stats-label">Work Timer</p>
            <p className="stat-value">{!workTimer ? "00:00:00" : workTimer}</p>
          </div>
          <div className="checkin-stat">
            <p className="stats-label">Check In Time</p>
            <p className="stat-value">
              {checkInTime
                ? // ? new Date(checkInTime).toLocaleTimeString(
                  //       "en-US",
                  //       {
                  //           hour: "2-digit",
                  //           minute: "2-digit",
                  //       }
                  //   )

                  checkInTime
                : "--:--:--"}
            </p>
          </div>
          <div className="checkin-stat">
            <p className="stats-label">Status</p>
            <p className="stat-value">
              {isCheckedIn ? "Working" : "Not Working"}
            </p>
          </div>
        </div>

        <div className="checkin-actions">
          <button
            onClick={handleCheckIn}
            disabled={isCheckedInToday()}
            className={`checkin-button ${
              isCheckedInToday() ? "button-disabled" : "button-enabled"
            }`}
          >
            <CheckCircle className="button-icon" />
            Check In
          </button>
          <button
            onClick={() => setShowModal(true)}
            disabled={!isCheckedIn}
            className={`checkout-button ${
              !isCheckedIn ? "button-disabled" : "button-enabled"
            }`}
          >
            <XCircle className="button-icon" />
            Check Out
          </button>
        </div>

        {/* Modal for confirming Check Out */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Confirm Check Out</h2>
              <p className="modal-message">Do you want to check out?</p>
              <div className="modal-buttons">
                <button
                  onClick={confirmCheckOut}
                  className="modal-button yes-button"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-button no-button"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Time Stats Section */}
        {showTimeStats && (
          <div className="time-alerts">
            {/* Late Coming Alert */}
            {todayStats.lateComing > 0 ? (
              <p className="late-alert">
                <XCircle className="alert-icon" />
                Late by {formatMinutes(todayStats.lateComing)}
              </p>
            ) : checkInTime ? (
              <p className="ontime-alert">
                <CheckCircle className="alert-icon" />
                On time arrival today
              </p>
            ) : null}

            {/* Overtime Alert */}
            {todayStats.overtime > 0 && (
              <p className="overtime-alert">
                <Clock className="alert-icon" />
                Overtime: {formatMinutes(todayStats.overtime)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      <div className="quick-stats">
        <div className="quick-stat-card">
          <Calendar className="quick-stat-icon" />
          <h3 className="quick-stat-title">Leave Balance</h3>
          <p className="quick-stat-value">15 days</p>
          <p className="quick-stat-subtitle">Annual Leave</p>
        </div>
        <div className="quick-stat-card">
          <Users className="quick-stat-icon" />
          <h3 className="quick-stat-title">Team</h3>
          <p className="quick-stat-value">Engineering</p>
          <p className="quick-stat-subtitle">Department</p>
        </div>
        <div className="quick-stat-card">
          <Building className="quick-stat-icon" />
          <h3 className="quick-stat-title">Office</h3>
          <p className="quick-stat-value">Silchar</p>
          <p className="quick-stat-subtitle">Location</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* <div className="notifications">
                    <h3 className="section-title">Recent Updates</h3>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="notification-card"
                        >
                            <div className="notification-icon">
                                {notification.type === "success" && (
                                    <CheckCircle className="notification-icon-img" />
                                )}
                                {notification.type === "warning" && (
                                    <Bell className="notification-icon-img" />
                                )}
                                {notification.type === "info" && (
                                    <Briefcase className="notification-icon-img" />
                                )}
                            </div>
                            <div className="notification-text">
                                <p className="notification-title">
                                    {notification.title}
                                </p>
                                <p className="notification-time">
                                    {notification.time}
                                </p>
                            </div>
                            <ArrowRight className="notification-action" />
                        </div>
                    ))}
                </div> */}

        <div className="notifications">
          <h3 className="section-title">Recent Updates</h3>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id} className="notification-card">
                <div className="notification-icon">
                  {notification.type === "success" && (
                    <CheckCircle className="notification-icon-img" />
                  )}
                  {notification.type === "warning" && (
                    <Bell className="notification-icon-img" />
                  )}
                  {notification.type === "info" && (
                    <Briefcase className="notification-icon-img" />
                  )}
                </div>
                <div className="notification-text">
                  <p className="notification-title">{notification.title}</p>
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-time">
                    {new Date(notification.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <ArrowRight className="notification-action" />
                {notification.status === "UNREAD" && (
                  <button
                    className="dashboard__notification-mark-read"
                    onClick={() => {
                      console.log("this is notification id:-", notification);
                      markAsRead(notification.id);
                    }}
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

        {/* Quick Actions */}
        {/* <div className="quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-action">
            <span className="action-title">Request Leave</span>
            <Calendar className="action-icon" />
          </div>
          <div className="quick-action">
            <span className="action-title">Submit Timesheet</span>
            <Clock className="action-icon" />
          </div>
          <div className="quick-action">
            <span className="action-title">View Schedule</span>
            <Calendar className="action-icon" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
