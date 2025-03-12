import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

// const API_BASE_URL = process.env.REACT_APP_API_URL 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(API_BASE_URL);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user"); // Clear corrupted data
    }
    setIsLoading(false);
  }, []);

  const generateDeviceId = () => {
    const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
  };

  const login = async (email, password) => {

    console.log("this is api base url",API_BASE_URL);
    console.log("........................................ojoj............... NEWNEWNEW");
    setIsLoading(true);

    const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
    const userAgent = navigator.userAgent;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      "x-refresh-token": localStorage.getItem("refreshToken") || "",
      "x-device-id": deviceId,
      "user-agent": userAgent,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email, password, deviceId, userAgent }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      setUser(data.roleName);
      console.log(data);
      
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", data.roleName);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("signedUserId", data.signedUserId);
      
      // navigate(data.roleName === "EMPLOYEE" ? "/employee" : "/admin", { replace: true });

      if (data.roleName === "EMPLOYEE") {
        navigate("/employee", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }

    } catch (error) {
      console.error("Login error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send password reset email");

      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Reset password error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
    const userAgent = navigator.userAgent;
    if (!accessToken || !refreshToken) {
      console.error("No access token or refresh token found");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      "x-refresh-token": localStorage.getItem("refreshToken") || "",
      "x-device-id": deviceId,
      "user-agent": userAgent,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers,
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("deviceId");
      localStorage.removeItem("userId");
      localStorage.removeItem("signedUserId");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetPassword, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}