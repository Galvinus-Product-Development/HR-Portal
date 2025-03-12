import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import "./PrivateRoute.css"; 
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PrivateRoute = ({ children }) => {
  const { user, isLoading, setUser ,logout} = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
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

      if (!accessToken) {
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
        console.log(data.roleName)
        console.log(data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", data.roleName);
        if(data.roleName=="EMPLOYEE"){
          navigate("/employee", { replace: true });
        }
        else{
          navigate("/admin", { replace: true });
        }
      } catch (error) {
        console.error("Login error:", error.message);
        logout();
        navigate('/login');
      }
      setAuthChecked(true);
    };

    verifyToken();
  }, []);

  if (isLoading || !authChecked) {//
    return (
      <div className="private-route-container">
        <div className="private-route-loader"></div>
      </div>
    );
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
