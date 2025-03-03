import React, { useState } from "react";
import { Shield, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import "./RegisterPage.css"; // Import external CSS

export default function AdminManagement() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle sending registration link
  const handleSendLink = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
      };
      const response = await fetch("http://localhost:5000/api/v1/admin/send-registration-link", {
        method: "POST",
        headers,
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration link sent successfully!");
      } else {
        throw new Error(data.message || "Failed to send link");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting an admin
  const handleDeleteUser = async () => {
    setError("");
    setSuccess("");
    setIsDeleting(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      "x-refresh-token": localStorage.getItem("refreshToken") || "",
    };
    try {
      const response = await fetch("http://localhost:5000/api/v1/admin/delete-user", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("User deleted successfully!");
        setEmail(""); // Clear input field
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-card">
          <div className="login-icon-wrapper">
            <div className="login-icon-bg">
              <Shield className="login-icon" />
            </div>
          </div>

          <h2 className="login-title">User Management</h2>

          {error && (
            <div className="login-error">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="login-success">
              <CheckCircle className="success-icon" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSendLink} className="login-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                User Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter user's email"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? "Sending..." : "Send Registration Link"}
            </button>
          </form>

          <div className="delete-user-section">
            <button
              onClick={handleDeleteUser}
              disabled={isDeleting || !email}
              className="delete-button"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
              <Trash2 className="delete-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
