import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContexts";
import { Shield, AlertCircle } from "lucide-react";
import "./LoginPage.css"; // Import external CSS

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, resetPassword, isLoading,user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // console.log(user);
      // let temp=localStorage.getItem("user");
      // console.log(temp);
      // if(temp=="EMPLOYEE"){
      //   navigate("/employee", { replace: true });
      // }
      // else{
      //   navigate("/admin", { replace: true });
      // }
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
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div className="reset-password">
              <button onClick={() => navigate("/reset-password")} className="login-button">
                Forgot Password?
              </button>
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
