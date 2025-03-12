import React, { useState } from 'react';
import { Bell, Search, Building2,LogOut } from 'lucide-react';
import './Header.css';
import gal_logo from '../../../assets/gal_logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../contexts/AuthContexts";
const Header = ({ pendingRequests }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleEmployeeRoute=()=>{
    navigate('/admin');
  }
  return (
    <header className="navbar-container">
      <div className="navbar-header">
        {/* <Building2 className="navbar-logo" /> */}
        <img src={gal_logo} className='navbar-logo' />
        <span className="navbar-title">Galvinus Employee Portal</span>
      </div>

      <div className="navbar-right">

        <div className="navbar-icons">
          <button className="navbar-notifications">
            <Bell className="navbar-bell-icon" />
            {pendingRequests > 0 && (
              <span className="notification-badge">{pendingRequests}</span>
            )}
          </button>
          <div className="navbar-profile" onClick={toggleDropdown}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin"
              className="navbar-profile-pic"
            />
            {/* <div>
              <p className="navbar-profile-name">Subhammmm Roy</p>
              <p className="navbar-profile-role">EMP ID -GAL0001</p>
            </div> */}
          </div>

          {showDropdown && (
            <div className="unique-profile-dropdown">
              <p className="unique-profile-dropdown-item">Subham Roy</p>
              <p className="unique-profile-dropdown-item unique-profile-role-item">
                HR Administrator
              </p>
              <p className="unique-profile-dropdown-item unique-profile-email-item">
                subham.roy@galvinus.com
              </p>
              <hr />
              <p className="unique-profile-dropdown-item">Reset Password</p>
              {/* <p className="unique-profile-dropdown-item">Logout</p> */}
              <button
                onClick={handleLogout}
                className="icon-button"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
              <button
                onClick={handleEmployeeRoute}
                className="icon-button"
                title="Logout"
              >
                Go to Admin Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
