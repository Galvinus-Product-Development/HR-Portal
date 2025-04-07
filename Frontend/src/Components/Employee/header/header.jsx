import React, { useState } from "react";
import { Bell, Building2, Search, LogOut,User,Upload ,LayoutDashboard } from "lucide-react";
import "./Header.css";
import gal_logo from "../../../assets/gal_logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContexts";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
const Header = ({ pendingRequests }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profileImage") ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  );
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleEmployeeRoute = () => {
    navigate("/admin");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId); // Assuming user object has an id

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/upload-profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.imageUrl) {
        setProfilePic(response.data.imageUrl);
        localStorage.setItem("profilePic", response.data.imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };


    const [selectedFile, setSelectedFile] = useState(null);
    const [userAvatar, setUserAvatar] = useState(localStorage.getItem("profilePicture") || null);
    
    // Update the handle file change function
    // const handleFileChange = (e) => {
    //   if (e.target.files && e.target.files[0]) {
    //     setSelectedFile(e.target.files[0]);
    //   }
    // };
    
    // Add a new upload function
    const handleUpload = () => {
      if (selectedFile) {
        // Here you would typically upload the file to your server
        // For now, let's just update the local state and localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target.result;
          setUserAvatar(imageData);
          localStorage.setItem("profilePicture", imageData);
          setSelectedFile(null);
        };
        reader.readAsDataURL(selectedFile);
      }
    };



  return (
    <header className="navbar-container">
      <div className="navbar-header">
        {/* <Building2 className="navbar-logo" /> */}
        <img src={gal_logo} className="navbar-logo" />
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
          <div className="unique-navbar-profile" onClick={toggleDropdown}>
            <img
              src={profilePic}
              alt="Admin"
              className="unique-navbar-profile-pic"
            />
          </div>

          {/* {showDropdown && (
            <div className="unique-profile-dropdown">
              <p className="unique-profile-dropdown-item">
                {localStorage.getItem("name") || "User"}
              </p>
              <p className="unique-profile-dropdown-item unique-profile-role-item">
                {localStorage.getItem("user") || "Employee"}
              </p>
              <p className="unique-profile-dropdown-item unique-profile-email-item">
                {localStorage.getItem("email") || "user@example.com"}
              </p>
              <hr />
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                onClick={handleLogout}
                className="icon-button"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
              {localStorage.getItem("user") !== "EMPLOYEE" && (
                <button
                  onClick={handleEmployeeRoute}
                  className="icon-button"
                  title="Go to Admin Dashboard"
                >
                  Go to Admin Dashboard
                </button>
              )}
            </div>
          )} */}

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
                  <span>Employee Dashboard</span>
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
    </header>
  );
};

export default Header;
