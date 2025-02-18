import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Timer, Calendar, Users, Building, Bell, Briefcase, ArrowRight } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workTimer, setWorkTimer] = useState('0:00:00');
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Leave request approved", time: "2 hours ago", type: "success" },
    { id: 2, title: "Team meeting at 2 PM", time: "1 hour ago", type: "info" },
    { id: 3, title: "Update your profile information", time: "30 mins ago", type: "warning" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const timer = setInterval(() => {
        const start = new Date(checkInTime).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setWorkTimer(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isCheckedIn, checkInTime]);

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      const now = new Date();
      setCheckInTime(now.toISOString());
      setIsCheckedIn(true);
    }
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setWorkTimer('0:00:00');
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <header>
          <h1 className="welcome-title">Welcome back, Subham!</h1>
          <p className="welcome-subtitle">Here's your HR dashboard overview</p>
        </header>
        <div className="current-time">
          <div className="current-time-text">
            <p className="time-label">Today's Date</p>
            <p className="time-value">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
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
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </div>
          <Timer className="checkin-icon" />
        </div>

        <div className="checkin-stats">
          <div className="checkin-stat">
            <p className="stats-label">Work Timer</p>
            <p className="stat-value">{workTimer}</p>
          </div>
          <div className="checkin-stat">
            <p className="stats-label">Check In Time</p>
            <p className="stat-value">
              {checkInTime
                ? new Date(checkInTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : '--:--'}
            </p>
          </div>
          <div className="checkin-stat">
            <p className="stats-label">Status</p>
            <p className="stat-value">{isCheckedIn ? 'Working' : 'Not Working'}</p>
          </div>
        </div>

        <div className="checkin-actions">
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className={`checkin-button ${isCheckedIn ? 'button-disabled' : 'button-enabled'}`}
          >
            <CheckCircle className="button-icon" />
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!isCheckedIn}
            className={`checkout-button ${!isCheckedIn ? 'button-disabled' : 'button-enabled'}`}
          >
            <XCircle className="button-icon" />
            Check Out
          </button>
        </div>
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
        <div className="notifications">
          <h3 className="section-title">Recent Updates</h3>
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <div className="notification-icon">
                {notification.type === 'success' && <CheckCircle className="notification-icon-img" />}
                {notification.type === 'warning' && <Bell className="notification-icon-img" />}
                {notification.type === 'info' && <Briefcase className="notification-icon-img" />}
              </div>
              <div className="notification-text">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-time">{notification.time}</p>
              </div>
              <ArrowRight className="notification-action" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
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
        </div>


      </div>

      <div>


      </div>
    </div>
  );
}
