import React, { useState } from 'react';
import { Bell, Search, Building2 } from 'lucide-react';
import './header.css';
import gal_logo from '../../../assets/gal_logo.png';

const Header = ({ pendingRequests }) => {
  return (
    <header className="navbar-container">
      <div className="navbar-header">
        {/* <Building2 className="navbar-logo" /> */}
        <img src={gal_logo} className='navbar-logo' />
        <span className="navbar-title">Galvinus Employee Portal</span>
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <Search className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="navbar-search-input"
          />
        </div>

        <div className="navbar-icons">
          <button className="navbar-notifications">
            <Bell className="navbar-bell-icon" />
            {pendingRequests > 0 && (
              <span className="notification-badge">{pendingRequests}</span>
            )}
          </button>
          <div className="navbar-profile">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin"
              className="navbar-profile-pic"
            />
            <div>
              <p className="navbar-profile-name">Subham Roy</p>
              <p className="navbar-profile-role">EMP ID -GAL0001</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
