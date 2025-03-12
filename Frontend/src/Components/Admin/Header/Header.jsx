import React, { useState } from "react";
import { Bell, Search ,LogOut} from "lucide-react";
import "./Header.css";
import gal_logo from "../../../assets/gal_logo.png";
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
    navigate('/employee');
  }
  return (
    <header className="unique-navbar-container">
      <div className="unique-navbar-header">
        <img src={gal_logo} className="unique-navbar-logo" />
        <span className="unique-navbar-title">Galvinus Admin Portal</span>
      </div>

      <div className="unique-navbar-right">
        {/* <div className="unique-search-container">
          <Search className="unique-navbar-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="unique-navbar-search-input"
          />
        </div> */}

        <div className="unique-navbar-icons">
          <button className="unique-navbar-notifications">
            <Bell className="unique-navbar-bell-icon" />
            {pendingRequests > 0 && (
              <span className="unique-notification-badge">
                {pendingRequests}
              </span>
            )}
          </button>
          <div className="unique-navbar-profile" onClick={toggleDropdown}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin"
              className="unique-navbar-profile-pic"
            />
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
                Go to Employee Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
