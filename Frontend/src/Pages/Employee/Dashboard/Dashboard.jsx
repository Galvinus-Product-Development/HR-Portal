import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Timer,
  Calendar,
  Users,
  Building,
  Bell,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import OvertimeManagementSystem from "./OvertimeManagementSystem";
const VITE_API_BASE_URL_NS = import.meta.env.VITE_API_BASE_URL_NS;
const VITE_API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
const API_BASE_URL_LM = import.meta.env.VITE_API_BASE_URL_LM;
import io from "socket.io-client";
import "./Dashboard.css";
const token = localStorage.getItem("accessToken");
const socket = io(`${VITE_SOCKET_URL}`, {
  path: "/ns/socket.io",
  transports: ["websocket", "polling"],
  auth: {
    token, // ✅ Send token for authentication
  },
});
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workTimer, setWorkTimer] = useState("00:00:00");
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState([]);
  //   const [employeeId, setEmployeeId] = useState("67b71d3c7960559f9b7bd5c1"); // This should come from auth context in a real app. Change the employee ID dynamically here.
  const [todayStats, setTodayStats] = useState({
    lateComing: 0,
    overtime: 0,
  });
  // State to control visibility of time stats alert
  const [showTimeStats, setShowTimeStats] = useState(false);
  // New state to control the visibility of the checkout confirmation modal
  const [showModal, setShowModal] = useState(false);

  // New state for overtime request form
  const [overtimeRequest, setOvertimeRequest] = useState({
    date: new Date().toISOString().split("T")[0],
    hours: 1,
    minutes: 0,
    reason: "",
  });
  const [overtimeSubmitting, setOvertimeSubmitting] = useState(false);
  const [overtimeSuccess, setOvertimeSuccess] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [employee, setEmployee] = useState();

  const employeeId = localStorage.getItem("userId"); // Storing the employee ID in local storage
  const userId = localStorage.getItem("userId");
  const localStorageCheckInTime = localStorage.getItem("checkInTime");
  // This useEffect will hide the stats after 3 seconds whenever showTimeStats becomes true
  // const ISTOffsetMs = 5.5 * 60 * 60 * 1000;


  const isCheckedInToday = () => {
    const weekEnd = new Date().getDay();
    if (weekEnd === 0 || weekEnd === 6) {
      return true; // If it's Sunday or Saturday, return true
    }
    if (!checkInTime) return false;
    const checkInDate = new Date(checkInTime);
    const today = new Date();
    return (
      checkInDate.getFullYear() === today.getFullYear() &&
      checkInDate.getMonth() === today.getMonth() &&
      checkInDate.getDate() === today.getDate()
    );
  };
  
  // Importing holidays and employee details here
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_LM}/api/holiday/`);

        if (!response.ok) {
          console.error("Unable to fetch holidays");
        }

        const data = await response.json();
        setHolidays(data);
      } catch (error) {
        console.error("Internal server error:", error);
      }
    }

    const fetchEmployee = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL_ED}/api/employees/${employeeId}`
        );

        if (!response.ok) {
          console.log("Unable to fetch employee details");
        }

        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Internal server error:", error);
      }
    }

    fetchHolidays();
    fetchEmployee();
  }, []);
  // This optional effect will ensure that once a new day starts, the app resets and enables the Check In button again.
	useEffect(() => {
		const timer = setInterval(() => {
			const today = new Date();
			// If checkInTime exists, and it's not today, reset it.
			if (checkInTime) {
				const checkInDate = new Date(checkInTime);
				if (
					checkInDate.getFullYear() !== today.getFullYear() ||
					checkInDate.getMonth() !== today.getMonth() ||
					checkInDate.getDate() !== today.getDate()
				) {
					setCheckInTime(null);
					setWorkTimer("00:00:00"); // -------------- CHANGED HERE ----------------
				}
			}
		}, 60000); // check every minute

		return () => clearInterval(timer);
	}, [checkInTime]);

  // This useEffect will hide the stats after 3 seconds whenever showTimeStats becomes true
  useEffect(() => {
    if (showTimeStats) {
      const timer = setTimeout(() => {
        setShowTimeStats(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showTimeStats]);

  // Fetch today's attendance on mount
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer1 = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer1);
  }, []);

  // Check if today is a weekend and mark absent if not checked in
  useEffect(() => {
    const today = new Date().getDay();
    if (today === 0 || today === 6 || isTodayHoliday()) {
      console.log("Today is a weekend or holiday. Skipping attendance check.");
      return;
    }

    const absentTimer = setInterval(async () => {
      const now = new Date();
      const cutoffHour = 10;
      const cutoffMinute = 35;
      if (
        now.getHours() > cutoffHour ||
        (now.getHours() === cutoffHour && now.getMinutes() >= cutoffMinute)
      ) {
        if (!isCheckedIn) {
          try {
            const response = await fetch(
              `${VITE_API_BASE_URL_AT}/api/attendance/manual`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  employeeId: employeeId,
                  date: now,
                  punchInTime: null,
                  punchOutTime: null,
                  attendanceStatus: "Absent",
                  punchInMethod: null,
                  punchOutMethod: null,
                  workingHours: 0,
                  lateComing: 0,
                  overtime: 0,
                }),
              }
            );

            if (!response.ok) {
              throw new Error(
                `Failed to mark absent automatically. Status: ${response.status}`
              );
            }

            const responseData = await response.json();

            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const monthlyAttendanceResponse = await fetch(
              `${VITE_API_BASE_URL_AT}/api/monthlyAttendance/${employeeId}?year=${year}&month=${month}&day=${day}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
              }
            );

            if (!monthlyAttendanceResponse.ok) {
              throw new Error("Failed to save monthly attendance");
            }
          } catch (error) {
            console.error("Auto absent error:", error);
          }
        } else {
          console.log("Employee has already checked in. No action needed.");
        }

        clearInterval(absentTimer);
      } else {
        console.log("Current time is before the cutoff time. Waiting...");
      }
    }, 60000);

    return () => {
      console.log("Clearing interval on component unmount.");
      clearInterval(absentTimer);
    };
  }, [isCheckedIn, employeeId]);

  const fetchLeaveBalance = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-balance?employeeId=${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch leave balance");
      const data = await response.json();
      setLeaveBalance(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Fetch the employee ID from localStorage
    const id = localStorage.getItem("userId");
    if (id) {
      fetchLeaveBalance(id);
    }
  }, []);

  useEffect(() => {
    const fetchEmploymentDetails = async () => {
      try {
        const signedUserId = localStorage.getItem("signedUserId"); // Fetch from localStorage

        if (!signedUserId) {
          setError("Unauthorized: No signedUserId found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL_ED}/api/employeeRoutes/employment/${signedUserId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch employment details.");
        }

        const data = await response.json();
        console.log("this is from data now...............", data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmploymentDetails();
  }, []);

  // This useEffect will hide the stats after 3 seconds whenever showTimeStats becomes true
  useEffect(() => {
    if (showTimeStats) {
      const timer = setTimeout(() => {
        setShowTimeStats(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showTimeStats]);

  // This useEffect will hide the overtime success message after 3 seconds
  useEffect(() => {
    if (overtimeSuccess) {
      const timer = setTimeout(() => {
        setOvertimeSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [overtimeSuccess]);

  // Fetch today's attendance on mount
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer1 = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer1);
  }, []);

  useEffect(() => {
    let timer;
    const checkedInTime = localStorage.getItem("checkInTime");
    if (checkedInTime) {
      setIsCheckedIn(true);

      // Convert to IST 12-hour format
      const check = convertToIST12HourFormat(checkedInTime);
      setCheckInTime(check);
      setWorkTimer(check);

      // 🔥 Clear existing interval before setting a new one
      if (window.workTimerInterval) {
        clearInterval(window.workTimerInterval);
      }

      timer = setInterval(() => {
        const start = new Date(checkedInTime).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setWorkTimer(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }, 1000);

      // Store interval globally
      console.log("Setting interval", timer);
      window.workTimerInterval = timer;
    }

    return () => {
      // Cleanup interval on component unmount or state change
      clearInterval(timer);
    };
  }, [isCheckedIn]);

  // Fetch today's attendance record
  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL_AT}/api/attendance/${employeeId}/today`
      );

      if (!response.ok) {
        if (response.status === 404) {
          // No attendance record found for today, that's ok
          return;
        }
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();

      if (data) {
        // Update stats
        setTodayStats({
          lateComing: data.lateComing || 0,
          overtime: data.overtime || 0,
        });

        if (data.punchInTime) {
          // If already checked out, just set checked out status
          if (data.punchOutTime) {
            setIsCheckedIn(false);
            // Reset work timer to 0 instead of showing total time
            setWorkTimer("00:00:00");
          } else {
            // If still checked in, set check-in time and status
            setIsCheckedIn(true);
            setCheckInTime(data.punchInTime);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  function convertToIST12HourFormat(localeString) {
    const date = new Date(localeString); // ------------------- CHANGED HERE -----------------------

    // Convert to IST (UTC +5:30)
    // const istOffset = 5.5 * 60 * 60 * 1000;
    // const istDate = new Date(date.getTime() + istOffset);
    const istDate = new Date(date.getTime());

    let hours = istDate.getHours();
    const minutes = String(istDate.getMinutes()).padStart(2, "0");
    const seconds = String(istDate.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  const handleWorkTimer = (startTime) => {
    if (window.workTimerInterval) {
      clearInterval(window.workTimerInterval);
    }

    window.workTimerInterval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - startTime;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setWorkTimer(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
  };

  // Handle Check In: create a new attendance record
  const handleCheckIn = async () => {
    if (!isCheckedIn) {
      if (window.workTimerInterval) {
        clearInterval(window.workTimerInterval);
      }
      const now = new Date();
      setCheckInTime(now.toLocaleString());
      setIsCheckedIn(true);
      try {
        // Create attendance record with status "Present"
        const dailyAttendanceResponse = await fetch(
          `${VITE_API_BASE_URL_AT}/api/attendance/manual`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              employeeId: employeeId,
              date: now,
              punchInTime: now.toLocaleString(),
              attendanceStatus: "Present",
              punchInMethod: "Dashboard",
            }),
          }
        );

        if (!dailyAttendanceResponse.ok) {
          throw new Error("Failed to check in");
        }

        // Get current date parts
        const dateNow = new Date();
        const year = dateNow.getFullYear();
        const month = dateNow.getMonth() + 1;
        const day = dateNow.getDate();

        // Fetch current monthly attendance data
        const getMonthlyAttendence = await fetch(
          `${VITE_API_BASE_URL_AT}/api/monthlyAttendance/${employeeId}?year=${year}&month=${month}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        let monthlyAttendanceResponse;

        if (!getMonthlyAttendence.ok) {
          monthlyAttendanceResponse = await fetch(
            `${VITE_API_BASE_URL_AT}/api/monthlyAttendance/${employeeId}?year=${year}&month=${month}&day=${day}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            }
          );

          if (!monthlyAttendanceResponse.ok) {
            throw new Error("Failed to save monthly attendance");
          }
        }

        const getMonthlyAttendenceData = await getMonthlyAttendence.json();
        console.log("Get Monthly Attendance Data", getMonthlyAttendenceData);

        // Ensure absentDays is a number (defaulting to 0 if undefined)				// ---------------- CHANGED HERE -----------------
        const currentAbsent = Number(getMonthlyAttendenceData?.absentDays) || 0;
        const newAbsent = Math.max(currentAbsent - 1, 0);
        console.log("Current Absent:", currentAbsent, "New Absent:", newAbsent);

        // Update monthly attendance by decrementing absentDays by 1
        monthlyAttendanceResponse = await fetch(
          `${VITE_API_BASE_URL_AT}/api/monthlyAttendance/${employeeId}?year=${year}&month=${month}&day=${day}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              absentDays: newAbsent,
            }),
          }
        );

        if (!monthlyAttendanceResponse.ok) {
          throw new Error("Failed to save monthly attendance");
        }

        const monthlyAttendanceData = await monthlyAttendanceResponse.json();
        console.log("Monthly Attendance Data", monthlyAttendanceData);

        // Process daily attendance response data for additional stats
        const data = await dailyAttendanceResponse.json();
        // const istTime = new Date(now); // Convert to IST		// ---------------------- CHANGED HERE -------------------------

        // let hours = istTime.getHours(); // ------------------------ CHANGED HERE -----------------------------
        // const minutes = String(istTime.getMinutes()).padStart(2, "0");
        // const seconds = String(istTime.getSeconds()).padStart(2, "0");

        // const ampm = hours >= 12 ? "PM" : "AM";
        // hours = hours % 12 || 12; // Convert '0' to '12'

        // const ist12HourTimeString = `${hours}:${minutes} ${ampm}`;
        // const ist12HourWorkTimer = `${hours}:${minutes}:${seconds} ${ampm}`;

        localStorage.setItem("checkInTime", now.toLocaleString()); // -------------- CHANGED HERE ---------------------
        const checkInTime123 = convertToIST12HourFormat(now.toLocaleString());
        setCheckInTime(checkInTime123);
        setWorkTimer("00:00:00");
        handleWorkTimer(now.getTime());

        setTodayStats({
          lateComing: data.lateComing || 0,
          overtime: data.overtime || 0,
        });

        setShowTimeStats(true);

        const newNotification = {
          id: Date.now(),
          title: `Checked in at ${now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          time: "Just now",
          type: "success",
        };
        setNotifications((prev) => [newNotification, ...prev.slice(0, 5)]);
      } catch (error) {
        console.error("Check-in error:", error);
        setIsCheckedIn(false);
        setCheckInTime(null);
      }
    }
  };

  const handleCheckOut = async () => {
    if (isCheckedIn) {
      const now = new Date();

      try {
        const dailyAttendanceResponse = await fetch(
          `${VITE_API_BASE_URL_AT}/api/attendance/${employeeId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              punchOutTime: now.toLocaleString(),
              punchOutMethod: "Dashboard",
            }),
          }
        );

        if (!dailyAttendanceResponse.ok) {
          throw new Error("Failed to check out");
        }

        setIsCheckedIn(false);
        setCheckInTime(null);
        clearInterval(window.workTimerInterval);
        window.workTimerInterval = null;
        setWorkTimer("00:00:00");
        localStorage.removeItem("checkInTime");

        // 🔥 Clear the interval on checkout

        // Update notifications
        const newNotification = {
          id: Date.now(),
          title: `Checked out at ${now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          time: "Just now",
          type: "info",
        };
        setNotifications((prev) => [newNotification, ...prev.slice(0, 5)]);
      } catch (error) {
        console.error("Check-out error:", error);
      }
    }
  };

  // Confirm Check Out: runs when the user confirms via the modal
  const confirmCheckOut = () => {
    setShowModal(false);
    handleCheckOut();
  };

  // Format minutes to a readable string
  const formatMinutes = (minutes) => {
    if (!minutes) return "0 mins";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + "m" : ""}`;
    }
    return `${mins}m`;
  };

  const dateTime = new Date(localStorageCheckInTime); // Example date-time		// --------------- CHANGED HERE -----------------
  const timeOnly = dateTime.toLocaleTimeString(); // Get only the time

  // Handle overtime request form submission
  const handleOvertimeSubmit = async (e) => {
    e.preventDefault();
    setOvertimeSubmitting(true);

    try {
      // Calculate total minutes
      const totalMinutes =
        parseInt(overtimeRequest.hours) * 60 +
        parseInt(overtimeRequest.minutes);

      const response = await fetch(
        `${VITE_API_BASE_URL_AT}/api/overtime-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: employeeId,
            date: overtimeRequest.date,
            minutes: totalMinutes,
            reason: overtimeRequest.reason,
            status: "PENDING",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit overtime request");
      }

      // Reset form
      setOvertimeRequest({
        date: new Date().toISOString().split("T")[0],
        hours: 1,
        minutes: 0,
        reason: "",
      });

      // Show success message
      setOvertimeSuccess(true);

      // Update notifications
      const newNotification = {
        id: Date.now(),
        title: `Overtime Request Submitted`,
        message: `${overtimeRequest.hours}h ${
          overtimeRequest.minutes
        }m requested for ${new Date(
          overtimeRequest.date
        ).toLocaleDateString()}`,
        time: "Just now",
        type: "info",
      };
      // setNotifications((prev) => [newNotification, ...prev.slice(0, 5)]);
    } catch (error) {
      console.error("Overtime request error:", error);
    } finally {
      setOvertimeSubmitting(false);
    }
  };

  // Handle overtime form input changes
  const handleOvertimeChange = (e) => {
    const { name, value } = e.target;
    setOvertimeRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isTodayHoliday = () => {
    if (!employee) return false; // Don't block if employee isn't loaded yet

    const today = new Date().toISOString().split("T")[0]; // Format: "YYYY-MM-DD"

    return holidays.some((holiday) => {
      const holidayDate = holiday.date.split("T")[0];
      const isLocationMatch =
        holiday.location === "Global" || holiday.location === employee.location;

      return holidayDate === today && isLocationMatch;
    });
  };
  const username = localStorage.getItem("name") || "User";

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <header>
          <h1 className="welcome-title">Welcome back, {username}!</h1>
          <p className="welcome-subtitle">Here's your HR dashboard overview</p>
        </header>
        <div className="current-time">
          <div className="current-time-text">
            <p className="time-label">Today's Date</p>
            <p className="time-value">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Clock className="current-time-icon" />
        </div>
      </div>

      {/* Check In/Out Section */}
      <div className="checkin-section">
        <div className="checkin-header">
          <div>
            <h2 className="checkin-title">Time Tracking</h2>
            <p className="checkin-time">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
          <Timer className="checkin-icon" />
        </div>

        <div className="checkin-stats">
          <div className="checkin-stat">
            <p className="stats-label">Work Timer</p>
            <p className="stat-value">{!workTimer ? "00:00:00" : workTimer}</p>
          </div>
          <div className="checkin-stat">
            <p className="stats-label">Check In Time</p>
            <p className="stat-value">
              {checkInTime
                ? // ? new Date(checkInTime).toLocaleTimeString(
                  //       "en-US",
                  //       {
                  //           hour: "2-digit",
                  //           minute: "2-digit",
                  //       }
                  //   )

                  timeOnly // --------------------- CHANGED HERE ------------------------
                : "--:--:--"}
            </p>
          </div>
          <div className="checkin-stat">
            <p className="stats-label">Status</p>
            <p className="stat-value">
              {isCheckedIn ? "Working" : "Not Working"}
            </p>
          </div>
        </div>

        <div className="checkin-actions">
          <button
            onClick={handleCheckIn}
            disabled={isCheckedInToday() || isTodayHoliday()}
            className={`checkin-button ${
              isCheckedInToday() || isTodayHoliday()
                ? "button-disabled"
                : "button-enabled"
            }`}
          >
            <CheckCircle className="button-icon" />
            Check In
          </button>
          <button
            onClick={() => setShowModal(true)}
            disabled={!isCheckedIn}
            className={`checkout-button ${
              !isCheckedIn ? "button-disabled" : "button-enabled"
            }`}
          >
            <XCircle className="button-icon" />
            Check Out
          </button>
        </div>

        {/* Modal for confirming Check Out */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Confirm Check Out</h2>
              <p className="modal-message">Do you want to check out?</p>
              <div className="modal-buttons">
                <button
                  onClick={confirmCheckOut}
                  className="modal-button yes-button"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-button no-button"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Time Stats Section */}
        {showTimeStats && (
          <div className="time-alerts">
            {/* Late Coming Alert */}
            {todayStats.lateComing > 0 ? (
              <p className="late-alert">
                <XCircle className="alert-icon" />
                Late by {formatMinutes(todayStats.lateComing)}
              </p>
            ) : checkInTime ? (
              <p className="ontime-alert">
                <CheckCircle className="alert-icon" />
                On time arrival today
              </p>
            ) : null}

            {/* Overtime Alert */}
            {todayStats.overtime > 0 && (
              <p className="overtime-alert">
                <Clock className="alert-icon" />
                Overtime: {formatMinutes(todayStats.overtime)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      <div className="quick-stats">
        <div className="quick-stat-card">
          <Calendar className="quick-stat-icon" />
          <h3 className="quick-stat-title">Leave Balance</h3>
          <p className="quick-stat-value">
            {leaveBalance?.casualBalance +
              leaveBalance?.sickBalance +
              leaveBalance?.compensatoryBalance}
          </p>
          <p className="quick-stat-subtitle">Annual Leave</p>
        </div>
        <div className="quick-stat-card">
          <Users className="quick-stat-icon" />
          <h3 className="quick-stat-title">Team</h3>
          <p className="quick-stat-value">{formData?.designation}</p>
          <p className="quick-stat-subtitle">{formData?.department}</p>
        </div>
        <div className="quick-stat-card">
          <Building className="quick-stat-icon" />
          <h3 className="quick-stat-title">Office</h3>
          <p className="quick-stat-value">{formData?.work_location}</p>
          <p className="quick-stat-subtitle">Location</p>
        </div>
      </div>
      <OvertimeManagementSystem />
    </div>
  );
}
