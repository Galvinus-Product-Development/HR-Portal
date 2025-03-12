import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContexts"; 
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Shield, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await resetPassword(email);
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setError("Failed to send password reset email. Please try again.");
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

          <h2 className="login-title">Reset Password</h2>

          {error && (
            <div className="login-error">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {message && <p className="success-message">{message}</p>}
          <form onSubmit={handleReset} className="login-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Send Reset Link
            </button>
            <button onClick={() => navigate("/login")} className="login-button">
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
