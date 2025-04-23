// import React, { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContexts";
// import "./PrivateRoute.css"; 
// import { useNavigate } from 'react-router-dom';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const PrivateRoute = ({ children }) => {
//   const { user, isLoading, setUser ,logout} = useAuth();
//   const [authChecked, setAuthChecked] = useState(false);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const verifyToken = async () => {
//       const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
//       const accessToken = localStorage.getItem("accessToken") || "";
//       const refreshToken = localStorage.getItem("refreshToken") || "";
//       const userAgent = navigator.userAgent;

//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//         "x-refresh-token": refreshToken,
//         "x-device-id": deviceId,
//         "user-agent": userAgent,
//       };

//       if (!accessToken) {
//         setAuthChecked(true);
//         return;
//       }
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
//           method: "POST",
//           headers,
//         });
  

//         if (!response.ok) throw new Error("Invalid credentials");

//         const data = await response.json();
//         setUser(data.roleName);
//         console.log(data.roleName)
//         console.log(data);
//         localStorage.setItem("accessToken", data.accessToken);
//         localStorage.setItem("refreshToken", data.refreshToken);
//         localStorage.setItem("user", data.roleName);
//         if(data.roleName=="EMPLOYEE"){
//           navigate("/employee", { replace: true });
//         }
//         else{
//           navigate("/admin", { replace: true });
//         }
//       } catch (error) {
//         console.error("Login error:", error.message);
//         logout();
//         navigate('/login');
//       }
//       setAuthChecked(true);
//     };

//     verifyToken();
//   }, []);

//   if (isLoading || !authChecked) {//
//     return (
//       <div className="private-route-container">
//         <div className="private-route-loader"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return <>{children}</>;
// };

// // Generate device ID and store it in localStorage
// const generateDeviceId = () => {
//   const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
//   localStorage.setItem("deviceId", deviceId);
//   return deviceId;
// };

// export default PrivateRoute;



import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import "./PrivateRoute.css"; 
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PrivateRoute = ({ children }) => {
  const { user, isLoading, setUser, logout } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const accessToken = localStorage.getItem("accessToken") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";
      const userAgent = navigator.userAgent;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
        "x-device-id": deviceId,
        "user-agent": userAgent,
      };

      console.log(accessToken);
      if (accessToken) {
        console.log("entered")
        setAuthChecked(true);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
          method: "POST",
          headers,
        });

        if (!response.ok) throw new Error("Invalid credentials");

        const data = await response.json();
        setUser(data.roleName);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", data.roleName);

        // Retrieve the original path user was trying to access
        // const from = location.state?.from?.pathname || (data.roleName === "EMPLOYEE" ? "/employee" : "/admin");

        // navigate(from, { replace: true });
        console.log("Came Here!");
      } catch (error) {
        console.log(error);
        console.error("Login error:", error.message);
        logout();
        navigate('/login');
      }

      setAuthChecked(true);
    };

    verifyToken();
  }, []);

  if (isLoading || !authChecked) {
    console.log("this is is loading",isLoading)
    console.log("this is is authChecked",!authChecked)
    return (
      <div className="private-route-container">
        <div className="private-route-loader"></div>
      </div>
    );
  }
  // Prevent an employee from accessing admin routes
  if (user === "EMPLOYEE" && location.pathname.includes("/admin")) {
    return <Navigate to="/employee" replace />;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Generate device ID and store it in localStorage
const generateDeviceId = () => {
  const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("deviceId", deviceId);
  return deviceId;
};

export default PrivateRoute;