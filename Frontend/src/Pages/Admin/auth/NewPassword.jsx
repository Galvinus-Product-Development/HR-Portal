// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./NewPassword.css"; // Import external CSS

// import { Shield, AlertCircle } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const NewPassword = () => {
//   const { token } = useParams();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/v1/auth/password-reset/complete`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token, password }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to reset password");

//       setMessage("Password reset successful! Redirecting to login...");
//       setTimeout(() => navigate("/login"), 3000);
//     } catch (error) {
//       setError("Error resetting password. Please try again.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="login-card">
//           <div className="login-icon-wrapper">
//             <div className="login-icon-bg">
//               <Shield className="login-icon" />
//             </div>
//           </div>

//           <h2 className="login-title">Set New Password</h2>

//           {error && (
//             <div className="login-error">
//               <AlertCircle className="error-icon" />
//               <span>{error}</span>
//             </div>
//           )}
//           {message && <p className="success-message">{message}</p>}
//           <form onSubmit={handleResetPassword} className="login-form">
//             <div className="input-group">
//               <label htmlFor="password" className="input-label">
//                 New Password
//               </label>
//               <input
//                 id="password"
//                 className="input-field"
//                 placeholder="Enter new password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label htmlFor="confirmPassword" className="input-label">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 className="input-field"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <button type="submit" className="login-button">
//               Reset Password
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewPassword;


import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewPassword.css"; // Import external CSS
import { Shield, AlertCircle, Eye, EyeOff } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*!]{8,}$/;

const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and contain both letters and numbers."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/password-reset/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      if (!response.ok) throw new Error("Failed to reset password");

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError("Error resetting password. Please try again.");
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

          <h2 className="login-title">Set New Password</h2>

          {error && (
            <div className="login-error">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}
          {message && <p className="success-message">{message}</p>}
          <form onSubmit={handleResetPassword} className="login-form">
            {/* New Password Field */}
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                New Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  className="input-field"
                  placeholder="Enter new password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* Confirm Password Field */}
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Reset Password
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

export default NewPassword;