// import React, { useState, useEffect } from "react";
// import { useLocation ,useParams} from "react-router-dom";

// export default function CompleteRegistration() {
//     const { token } = useParams();
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       setError("No registration token found.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/v1/admin/complete-registration/${token}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({  name, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess("Registration completed successfully!");
//       } else {
//         throw new Error(data.message || "Failed to complete registration.");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Complete Registration</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Enter a password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Complete Registration</button>
//       </form>
//     </div>
//   );
// }




import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./CompleteRegistration.css";

export default function CompleteRegistration() {
  const { token } = useParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("No registration token found.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/complete-registration/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration completed successfully!");
        setError("");
      } else {
        throw new Error(data.message || "Failed to complete registration.");
      }
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2 className="title">Complete Registration</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}
