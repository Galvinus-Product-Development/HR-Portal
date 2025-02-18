import React, { useState } from "react";
import "./sidebar.css";
import {
  BarChart3,
  Calendar,
  Users,
  Clock,
  GraduationCap,
  Award,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Get current route
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [leaveOpen, setLeaveOpen] = useState(
    location.pathname.startsWith("/employee/leave-management")
  );
  const [attendanceOpen, setAttendanceOpen] = useState(
    location.pathname.startsWith("/employee/attendance")
  );

  const navigation = [
    { name: "Dashboard", icon: BarChart3, path: "/employee" },
    {
      name: "Attendance",
      icon: Clock,
      path: "/employee/attendance",
      subMenu: [
        { name: "Attendance Tracker", path: "/employee/attendance/tracker" },
        { name: "Attendance Dashboard", path: "/employee/attendance/dashboard" },
      ],
    },
    { name: "Employee Database", icon: Users, path: "/employee/employee/personal" },
    {
      name: "Leave Management",
      icon: Calendar,
      path: "/employee/leave-management",
      subMenu: [
        { name: "Request Leave", path: "/employee/leave-management/request-leave" },
        { name: "Leave History", path: "/employee/leave-management/leave-history" },
        { name: "Leave Policy", path: "/employee/leave-management/leave-policy" },
      ],
    },
    { name: "Training and Learning", icon: GraduationCap, path: "/employee/training" },
    { name: "Certification and Badges", icon: Award, path: "/employee/certification" },
    // { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="sidebar-container">
      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <div key={item.path}>
            {item.subMenu ? (
              <>
                <div
                  className={`sidebar-item ${
                    activeTab.startsWith(item.path) ? "active" : ""
                  }`}
                  onClick={() => {
                    if (item.name === "Leave Management")
                      setLeaveOpen(!leaveOpen);
                    if (item.name === "Attendance")
                      setAttendanceOpen(!attendanceOpen);
                  }}
                >
                  <item.icon className="sidebar-icon" />
                  <Link
                    to={item.path}
                    className="sidebar-link"
                    onClick={() => setActiveTab(item.path)}
                  >
                    {item.name}
                  </Link>
                  <ChevronDown
                    className={`dropdown-icon ${
                      (item.name === "Leave Management" && leaveOpen) ||
                      (item.name === "Attendance" && attendanceOpen)
                        ? "open"
                        : ""
                    }`}
                  />
                </div>
                {((item.name === "Leave Management" && leaveOpen) ||
                  (item.name === "Attendance" && attendanceOpen)) && (
                  <div className="submenu">
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={`submenu-item ${
                          activeTab === sub.path ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(sub.path)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                onClick={() => setActiveTab(item.path)}
                className={`sidebar-item ${
                  activeTab === item.path ? "active" : ""
                }`}
              >
                <item.icon className="sidebar-icon" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <footer className="sidebar-footer">
        Designed and developed by <b>Galvinus Pvt Ltd</b>
      </footer>
    </div>
  );
};

export default Sidebar;
