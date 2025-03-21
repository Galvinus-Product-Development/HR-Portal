import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContexts";
import { Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import "./LoginPage.css"; // Import external CSS

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login, resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*!]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(galvinus\.com|galvinus\.in|gmail\.com)$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Email must be from galvinus.com, galvinus.in, or gmail.com.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
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

          <h2 className="login-title">HR Portal Login</h2>

          {error && (
            <div className="login-error">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
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
              {emailError && <p className="error-text">{emailError}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="error-text">{passwordError}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div className="reset-password">
              <p onClick={() => navigate("/reset-password")} >
                Forgot Password?
              </p>
            </div>

            <div className="login-demo-credentials">
              Demo credentials:
              <br />
              Email: debswarnadeep85@gmail.com
              <br />
              Password: SuperAdmin@123
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




