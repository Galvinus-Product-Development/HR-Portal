import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Briefcase, CreditCard } from 'lucide-react';
import './EmployeeLayout.css';

export default function EmployeeLayout() {
  const tabs = [
    { path: 'personal', label: 'Personal Details', icon: User },
    { path: 'employment', label: 'Employment Details', icon: Briefcase },
    { path: 'bank', label: 'Bank Details', icon: CreditCard },
  ];

  return (
    <div className="employee-layout-container">
      <header>
        <h1 className="employee-title">Employee Database</h1>
        <p className="employee-subtitle">Manage employee information and records</p>
      </header>

      <div className="employee-card">
        <div className="employee-nav-container">
          <nav className="employee-nav" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    `employee-nav-link ${isActive ? 'active' : ''}`
                  }
                  end
                >
                  <Icon className="employee-icon" />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="employee-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
