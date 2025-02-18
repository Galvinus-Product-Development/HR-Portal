import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList } from 'lucide-react';
import './Attendance.css'

export default function Attendance() {
  const location = useLocation();

  const tabs = [

    {
      path: '/attendance/tracker',
      label: 'Attendance Tracker',
      icon: ClipboardList,
    },
    {
      path: '/attendance/dashboard',
      label: 'Attendance Dashboard',
      icon: LayoutDashboard,
    },

  ];

  return (
    <div className="attendance-container">
      <header>
        <h1 className="attendance-title">Attendance Management</h1>
        <p className="attendance-description">Track and manage your attendance records</p>
      </header>

      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `tab-item ${isActive ? 'tab-active' : ''}`
                }
              >
                <Icon className="icon" />
                {tab.label}
              </NavLink>
            );
          })}
        </div>
        <div className="tabs-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
