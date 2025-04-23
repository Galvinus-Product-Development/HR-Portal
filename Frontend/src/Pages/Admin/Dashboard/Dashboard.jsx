import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarClock,
  User,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Folder,
  FolderPlus,
  Settings,
  Move,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import io from "socket.io-client";
import "./Dashboard.css";
import "../Notification/NotificationPage";

const generateDeviceId = () => {
  const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("deviceId", deviceId);
  return deviceId;
};
console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
const API_BASE_URL_AT = import.meta.env.VITE_API_BASE_URL_AT;
const API_BASE_URL_NS = `${import.meta.env.VITE_API_BASE_URL_NS}`;
const API_BASE_URL_LM = `${import.meta.env.VITE_API_BASE_URL_LM}`;
const API_BASE_URL_ED = import.meta.env.VITE_API_BASE_URL_ED;
const ATTENDANCE_API_BASE_URL = `${API_BASE_URL_AT}/api`;

const LEAVE_API_BASE_URL = `${API_BASE_URL_LM}/api`;
// Available card templates
const cardTemplates = [
  {
    id: "totalEmployees",
    label: "Total Employees",
    icon: Users,
    colorClass: "dashboard__stats-icon-blue",
    dataKey: "totalEmployees",
  },
  {
    id: "onLeaveToday",
    label: "On Leave Today",
    icon: Calendar,
    colorClass: "dashboard__stats-icon-green",
    dataKey: "onLeaveToday",
  },
  {
    id: "pendingLeaves",
    label: "Pending Leaves",
    icon: CalendarClock,
    colorClass: "dashboard__stats-icon-yellow",
    dataKey: "pendingLeaves",
  },
  {
    id: "activeEmployees",
    label: "Active Employees",
    icon: User,
    colorClass: "dashboard__stats-icon-purple",
    dataKey: "activeEmployees",
  },
  {
    id: "newHires",
    label: "New Hires",
    icon: User,
    colorClass: "dashboard__stats-icon-pink",
    dataKey: "newHires",
  },
  {
    id: "presentToday",
    label: "Present Today",
    icon: Calendar,
    colorClass: "dashboard__stats-icon-orange",
    dataKey: "presentToday",
  },
  {
    id: "absentToday",
    label: "Absent Today",
    icon: Calendar,
    colorClass: "dashboard__stats-icon-orange",
    dataKey: "absentToday",
  },
  {
    id: "halfDay",
    label: "Half Day",
    icon: Calendar,
    colorClass: "dashboard__stats-icon-orange",
    dataKey: "halfDay",
  },
];

// Card component with drag and drop functionality
const StatCard = ({ card, onRemove, index, moveCard, groupId }) => {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: card.id, index, groupId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragGroupId = item.groupId;
      const hoverGroupId = groupId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragGroupId === hoverGroupId) {
        return;
      }

      moveCard(dragGroupId, hoverGroupId, dragIndex, hoverIndex);
      item.index = hoverIndex;
      item.groupId = hoverGroupId;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`dashboard__stats-card ${
        isDragging ? "dashboard__dragging" : ""
      }`}
    >
      <div className="dashboard__stats-card-content">
        <div>
          <p className="dashboard__stats-label">{card.label}</p>
          <p className="dashboard__stats-value">{card.value || 0}</p>
        </div>
        <div className={`dashboard__stats-icon-container ${card.colorClass}`}>
          {/* <card.icon className="dashboard__stats-icon" /> */}
        </div>
      </div>
      <button
        className="dashboard__card-remove-btn"
        onClick={() => onRemove(card.id, groupId)}
        title="Remove Card"
      >
        <Trash2 size={16} />
      </button>
      <div className="dashboard__card-drag-handle" title="Drag to reorder">
        <Move size={16} />
      </div>
    </div>
  );
};

// Group component
const CardGroup = ({
  group,
  onRemoveCard,
  onRemoveGroup,
  onRenameGroup,
  moveCard,
  moveGroup,
  index,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const groupRef = React.useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "GROUP",
    item: { id: group.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: "GROUP",
    hover(item, monitor) {
      if (!groupRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveGroup(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const handleSave = () => {
    onRenameGroup(group.id, groupName);
    setIsEditing(false);
  };

  drag(drop(groupRef));

  return (
    <div
      ref={groupRef}
      className={`dashboard__card-group ${
        isDragging ? "dashboard__dragging" : ""
      }`}
    >
      <div className="dashboard__group-header">
        {isEditing ? (
          <div className="dashboard__group-edit">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="dashboard__group-name-input"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="dashboard__group-btn"
              title="Save"
            >
              <Save size={16} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="dashboard__group-btn"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="dashboard__group-title">
            <Folder size={18} className="dashboard__group-icon" />
            <h3>{group.name}</h3>
            <div className="dashboard__group-actions">
              <button
                onClick={() => setIsEditing(true)}
                className="dashboard__group-btn"
                title="Edit Group Name"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onRemoveGroup(group.id)}
                className="dashboard__group-btn"
                title="Delete Group"
              >
                <Trash2 size={16} />
              </button>
              <div
                className="dashboard__group-drag-handle"
                title="Drag to reorder"
              >
                <Move size={16} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="dashboard__group-cards">
        {group.cards.map((card, index) => (
          <StatCard
            key={card.id}
            card={card}
            index={index}
            groupId={group.id}
            onRemove={onRemoveCard}
            moveCard={moveCard}
          />
        ))}
      </div>
    </div>
  );
};

// AddCardModal component
const AddCardModal = ({
  isOpen,
  onClose,
  onAddCard,
  availableCards,
  selectedGroupId,
}) => {
  const [selectedCardId, setSelectedCardId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCardId) {
      const cardTemplate = cardTemplates.find(
        (card) => card.id === selectedCardId
      );
      onAddCard(cardTemplate, selectedGroupId);
      setSelectedCardId("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dashboard__modal-overlay">
      <div className="dashboard__modal">
        <div className="dashboard__modal-header">
          <h3>Add New Card</h3>
          <button onClick={onClose} className="dashboard__modal-close">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="dashboard__modal-form">
          <div className="dashboard__modal-body">
            <div className="dashboard__form-group">
              <label htmlFor="cardType">Select Card Type</label>
              <select
                id="cardType"
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="dashboard__select"
                required
              >
                <option value="">-- Select a card --</option>
                {availableCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="dashboard__modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="dashboard__btn dashboard__btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dashboard__btn dashboard__btn-primary"
              disabled={!selectedCardId}
            >
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AddGroupModal component
const AddGroupModal = ({ isOpen, onClose, onAddGroup }) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      onAddGroup(groupName);
      setGroupName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dashboard__modal-overlay">
      <div className="dashboard__modal">
        <div className="dashboard__modal-header">
          <h3>Add New Group</h3>
          <button onClick={onClose} className="dashboard__modal-close">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="dashboard__modal-form">
          <div className="dashboard__modal-body">
            <div className="dashboard__form-group">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="dashboard__input"
                placeholder="Enter group name"
                required
              />
            </div>
          </div>
          <div className="dashboard__modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="dashboard__btn dashboard__btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dashboard__btn dashboard__btn-primary"
              disabled={!groupName.trim()}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  ///////////////////////////////////////////////

  const [employeess, setEmployeess] = useState([]);

  const [todayLeaveRecords, setTodayLeaveRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    priority: "NORMAL",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch employees from backend

  // Move socket initialization inside component
  const [socket, setSocket] = useState(null);

  // const [pendingLeaves, setPendingLeaves] = useState([]);
  const [overtimeRequests, setOvertimeRequests] = useState([]);

  useEffect(() => {
    // Fetch data logic would go here
    // Sample data for demonstration
    setPendingLeaves([
      {
        id: 1,
        name: "John Doe",
        department: "Engineering",
        type: "Annual Leave",
        duration: "3 days",
        startDate: "2025-04-15",
        endDate: "2025-04-17",
        reason: "Family vacation",
        appliedOn: "2025-04-10T09:30:00",
        employee: { avatar: "/api/placeholder/40/40" },
      },
      {
        id: 2,
        name: "Jane Smith",
        department: "Marketing",
        type: "Sick Leave",
        duration: "1 day",
        startDate: "2025-04-14",
        endDate: "2025-04-14",
        reason: "Doctor's appointment",
        appliedOn: "2025-04-13T15:20:00",
        employee: { avatar: "/api/placeholder/40/40" },
      },
    ]);

    setOvertimeRequests([
      {
        id: 101,
        name: "Michael Brown",
        department: "Operations",
        hours: 3.5,
        date: "2025-04-13",
        timeRange: "17:30 - 21:00",
        reason: "End of month report preparation",
        appliedOn: "2025-04-12T14:15:00",
        employee: { avatar: "/api/placeholder/40/40" },
      },
      {
        id: 102,
        name: "Sarah Johnson",
        department: "Customer Support",
        hours: 2,
        date: "2025-04-14",
        timeRange: "18:00 - 20:00",
        reason: "System upgrade assistance",
        appliedOn: "2025-04-13T09:45:00",
        employee: { avatar: "/api/placeholder/40/40" },
      },
    ]);
  }, []);

  // const getLeaveTypeColor = (type) => {
  //   switch (type) {
  //     case "Annual Leave":
  //       return "dashboard__leave-type--annual";
  //     case "Sick Leave":
  //       return "dashboard__leave-type--sick";
  //     case "Personal Leave":
  //       return "dashboard__leave-type--personal";
  //     default:
  //       return "dashboard__leave-type--other";
  //   }
  // };

  // const handleFinalDecision = (id, status) => {
  //   console.log(`Leave request ${id} ${status}`);
  //   // Handle status update logic
  // };

  // const handleOvertimeDecision = (id, status) => {
  //   console.log(`Overtime request ${id} ${status}`);
  //   // Handle overtime status update logic
  // };

  // const navigate = (path) => {
  //   console.log(`Navigating to ${path}`);
  //   // Navigation logic
  // };

  // Socket connection/disconnection
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const newSocket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
      path: "/ns/socket.io",
      transports: ["websocket", "polling"],
      auth: {
        token,
      },
    });

    setSocket(newSocket);

    // Cleanup function to properly disconnect
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentDay = today.getDate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
        const userAgent = navigator.userAgent;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          "x-refresh-token": localStorage.getItem("refreshToken") || "",
          "x-device-id": deviceId, // Send deviceId in headers
          "user-agent": userAgent, // Send user agent in headers
        };

        const response = await fetch(
          `${API_BASE_URL_ED}/api/employeeRoutes/formatted`,
          {
            method: "GET",
            headers,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching employees:", err);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification({ ...notification, [name]: value });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id));
    }
  };

  const handleEmployeeSelect = (empId) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const handleFilterByDepartment = (dept) => {
    if (dept === "All") return employees;
    return employees.filter((emp) => emp.department === dept);
  };

  const sendNotification = async () => {
    if (selectedEmployees.length === 0) {
      setError("Please select at least one employee");
      return;
    }

    if (!notification.title.trim() || !notification.message.trim()) {
      setError("Title and message are required");
      return;
    }

    setIsLoading(true);
    setError("");
    console.log("Selected Employees:", JSON.stringify(selectedEmployees));
    try {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };

      const response = await fetch(`${API_BASE_URL_NS}/api/notifications`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userIds: selectedEmployees, // 🔹 Changed from `recipients` to `userIds`
          type: "MANUAL", // 🔹 Added missing `type` field (update if needed)
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          redirectUrl: notification.redirectUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      setSuccessMessage("Notification sent successfully!");
      setNotification({ title: "", message: "", priority: "NORMAL" });
      setSelectedEmployees([]);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error sending notification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueDepartments = [
    "All",
    ...new Set(employees.map((emp) => emp.department)),
  ];
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const filteredEmployees = handleFilterByDepartment(selectedDepartment);

  /////////////////////////////////////////////////////////

  // State for dashboard data
  useEffect(() => {
    const fetchTodayLeaveRecords = async () => {
      try {
        // Fetch the leave records for the current month
        console.log("I have fetch that....................");
        const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
        const userAgent = navigator.userAgent;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          "x-refresh-token": localStorage.getItem("refreshToken") || "",
          "x-device-id": deviceId, // Send deviceId in headers
          "user-agent": userAgent, // Send user agent in headers
        };
        const response = await fetch(
          `${LEAVE_API_BASE_URL}/leave-history?year=${currentYear}&month=${currentMonth}`,
          {
            method: "GET",
            headers,
          }
        );
        if (!response.ok)
          throw new Error("Failed to fetch today's leave records");
        const data = await response.json();

        // Filter to keep only records that match the current day
        const todaysRecords = data.filter((record) => {
          const recordDate = new Date(record.appliedOn);
          return (
            recordDate.getDate() === today.getDate() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === currentYear &&
            (record.status === "PAID" || record.status === "UNPAID")
          );
        });

        setTodayLeaveRecords(todaysRecords);
      } catch (error) {
        console.error("Error fetching leave records:", error);
      }
    };

    fetchTodayLeaveRecords();
  }, [currentYear, currentMonth, currentDay]);
  const fetchEmployeess = async () => {
    setError(null);
    try {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };
      // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@1")
      // Using the getAllEmployees endpoint from employeeRoutes.js
      console.log("API URL:", `${ATTENDANCE_API_BASE_URL}/employees`);

      const response = await fetch(`${ATTENDANCE_API_BASE_URL}/employees`, {
        method: "GET",
        headers,
      });
      if (!response.ok) {
        console.log("I got here!!!!!");
        throw new Error("Failed to fetch employee data");
      }
      const data = await response.json();
      console.log("THis is set Employeess", data);
      setEmployeess(data);
    } catch (err) {
      setError(err.message);
    } finally {
    }
  };
  const getTodayAttendance = (employee) => {
    if (!employee.attendance || employee.attendance.length === 0) {
      return null;
    }

    return employee.attendance.find(
      (att) => new Date(att.date).toDateString() === today.toDateString()
    );
  };

  // Determine employee status
  const getEmployeeStatus = (employee) => {
    const hasLeaveRecord = todayLeaveRecords.some(
      (record) => record.employeeId === employee.id
    );

    if (hasLeaveRecord) return "On Leave";

    const todayAttendance = getTodayAttendance(employee);
    return todayAttendance ? todayAttendance.attendanceStatus : "Not Marked";
  };

  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    pendingLeaves: 0,
    activeEmployees: 0,
    newHires: 0,
    presentToday: 0,
    absentToday: 0,
    halfDay: 0,
  });
  const [pendingLeaves, setPendingLeaves] = useState([]);

  // State for customizable dashboard
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem("dashboardGroups");
    if (savedGroups) {
      return JSON.parse(savedGroups);
    }
    return [
      {
        id: "default",
        name: "Main Statistics",
        cards: [
          { ...cardTemplates[0], value: 0 },
          { ...cardTemplates[1], value: 0 },
          { ...cardTemplates[2], value: 0 },
          { ...cardTemplates[3], value: 0 },
        ],
      },
    ];
  });

  // State for modals
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [selectedGroupForCard, setSelectedGroupForCard] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Save groups to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboardGroups", JSON.stringify(groups));
  }, [groups]);

  // Update card values when dashboardStats change
  useEffect(() => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        cards: group.cards.map((card) => ({
          ...card,
          value: dashboardStats[card.dataKey] || 0,
        })),
      }))
    );
  }, [dashboardStats]);

  // Fetch data useEffect
  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployeess();
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
        const userAgent = navigator.userAgent;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          "x-refresh-token": localStorage.getItem("refreshToken") || "",
          "x-device-id": deviceId, // Send deviceId in headers
          "user-agent": userAgent, // Send user agent in headers
        };
        const response = await fetch(
          `${API_BASE_URL_NS}/api/notifications/dashboard-stats`,
          {
            method: "GET",
            headers,
          }
        );
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await response.json();
        console.log("this is summary data:-", employeess);
        const attendanceCounts = {
          present: employeess.filter(
            (emp) => getEmployeeStatus(emp) === "Present"
          ).length,
          absent: employeess.filter(
            (emp) => getEmployeeStatus(emp) === "Absent"
          ).length,
          halfDay: employeess.filter(
            (emp) => getEmployeeStatus(emp) === "Half Day"
          ).length,
          onLeave: employeess.filter(
            (emp) => getEmployeeStatus(emp) === "On Leave"
          ).length,
        };
        console.log(attendanceCounts);
        data.presentToday = attendanceCounts.present;
        data.absent = attendanceCounts.absent;
        data.halfDay = attendanceCounts.halfDay;
        console.log(data);
        setDashboardStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    const fetchPendingLeaves = async () => {
      try {
        const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
        const userAgent = navigator.userAgent;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          "x-refresh-token": localStorage.getItem("refreshToken") || "",
          "x-device-id": deviceId, // Send deviceId in headers
          "user-agent": userAgent, // Send user agent in headers
        };
        const response = await fetch(
          `${API_BASE_URL_LM}/api/leave-requests/pending/${userId}`,
          {
            headers,
            method: "POST",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch pending leaves");
        const data = await response.json();
        setPendingLeaves(data);
      } catch (error) {
        console.error("Error fetching pending leaves:", error);
      }
    };

    fetchDashboardStats();
    fetchPendingLeaves();
  }, [userId, employeess]);

  // Get available cards that aren't already used
  const getAvailableCards = (groupId) => {
    const usedCardIds = new Set();
    groups.forEach((group) => {
      if (group.id === groupId) return; // Skip the current group when checking
      group.cards.forEach((card) => {
        usedCardIds.add(card.id);
      });
    });

    return cardTemplates.filter((card) => !usedCardIds.has(card.id));
  };

  // Handle adding a new card
  const handleAddCard = (cardTemplate, groupId) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            cards: [
              ...group.cards,
              {
                ...cardTemplate,
                value: dashboardStats[cardTemplate.dataKey] || 0,
              },
            ],
          };
        }
        return group;
      })
    );
  };

  // Handle removing a card
  const handleRemoveCard = (cardId, groupId) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            cards: group.cards.filter((card) => card.id !== cardId),
          };
        }
        return group;
      })
    );
  };

  // Handle adding a new group
  const handleAddGroup = (groupName) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      cards: [],
    };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  // Handle removing a group
  const handleRemoveGroup = (groupId) => {
    setGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId)
    );
  };

  // Handle renaming a group
  const handleRenameGroup = (groupId, newName) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return { ...group, name: newName };
        }
        return group;
      })
    );
  };

  // Handle moving a card between or within groups
  const moveCard = (fromGroupId, toGroupId, fromIndex, toIndex) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];

      // Find the source and destination groups
      const fromGroupIndex = newGroups.findIndex((g) => g.id === fromGroupId);
      const toGroupIndex = newGroups.findIndex((g) => g.id === toGroupId);

      if (fromGroupIndex === -1 || toGroupIndex === -1) return prevGroups;

      // Get the card being moved
      const [movedCard] = newGroups[fromGroupIndex].cards.splice(fromIndex, 1);

      // Insert the card at the new position
      newGroups[toGroupIndex].cards.splice(toIndex, 0, movedCard);

      return newGroups;
    });
  };

  // Handle moving groups
  const moveGroup = (fromIndex, toIndex) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const [movedGroup] = newGroups.splice(fromIndex, 1);
      newGroups.splice(toIndex, 0, movedGroup);
      return newGroups;
    });
  };

  // Helper function for leave type color
  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Annual Leave":
        return "dashboard__leave-annual";
      case "Sick Leave":
        return "dashboard__leave-sick";
      case "Personal Leave":
        return "dashboard__leave-personal";
      default:
        return "dashboard__leave-default";
    }
  };

  const handleFinalDecision = async (id, decision) => {
    let statusToUpdate = decision;
    if (decision === "onHold") {
      statusToUpdate = "ON_HOLD";
    } else if (decision === "approved") {
      statusToUpdate = "APPROVED";
    } else if (decision === "rejected") {
      statusToUpdate = "REJECTED";
    }

    try {
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      const userAgent = navigator.userAgent;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        "x-refresh-token": localStorage.getItem("refreshToken") || "",
        "x-device-id": deviceId, // Send deviceId in headers
        "user-agent": userAgent, // Send user agent in headers
      };
      const response = await fetch(
        `${API_BASE_URL_LM}/api/leave-requests/${id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ status: statusToUpdate }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update leave request to ${statusToUpdate}`);
      }

      // Refresh leaves after update
      const refreshResponse = await fetch(
        `${API_BASE_URL_LM}/api/leave-requests/pending/${userId}`,
        {
          method: "GET",
          headers,
        }
      );
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setPendingLeaves(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dashboard__container">
        <div className="dashboard__header">
          <div className="dashboard__header-left">
            <LayoutDashboard className="dashboard__header-icon" />
            <h1 className="dashboard__header-title">Admin Dashboard</h1>
          </div>
          <div className="dashboard__header-actions">
            <button
              className={`dashboard__edit-toggle ${
                isEditMode ? "dashboard__edit-active" : ""
              }`}
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            >
              <Settings size={20} />
              {isEditMode ? "Exit Edit Mode" : "Customize Dashboard"}
            </button>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="dashboard__stats-section">
          {isEditMode && (
            <div className="dashboard__edit-toolbar">
              <button
                className="dashboard__btn dashboard__btn-secondary"
                onClick={() => setIsAddGroupModalOpen(true)}
              >
                <FolderPlus size={16} />
                Add New Group
              </button>
            </div>
          )}

          {groups.map((group, index) => (
            <div key={group.id} className="dashboard__group-wrapper">
              <CardGroup
                group={group}
                index={index}
                onRemoveCard={handleRemoveCard}
                onRemoveGroup={handleRemoveGroup}
                onRenameGroup={handleRenameGroup}
                moveCard={moveCard}
                moveGroup={moveGroup}
              />

              {isEditMode && (
                <button
                  className="dashboard__add-card-btn"
                  onClick={() => {
                    setSelectedGroupForCard(group.id);
                    setIsAddCardModalOpen(true);
                  }}
                  disabled={getAvailableCards(group.id).length === 0}
                >
                  <Plus size={16} />
                  Add Card
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Main Grid - Now only with Leave Requests */}
        <div className="dashboard__main-grid">
          <div className="notification-page">
            <div className="notification-header">
              <h1>Send Notifications</h1>
              <p>Compose and send notifications to employees</p>
            </div>

            <div className="notification-container">
              <div className="notification-form-section">
                <h2>Notification Details</h2>
                <div className="notification-form">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={notification.title}
                      onChange={handleInputChange}
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={notification.message}
                      onChange={handleInputChange}
                      placeholder="Enter your message here"
                      rows="5"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={notification.priority}
                      onChange={handleInputChange}
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="redirectUrl">Redirect URL</label>
                    <input
                      type="text"
                      id="redirectUrl"
                      name="redirectUrl"
                      value={notification.redirectUrl || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. https://example.com/details-page"
                    />
                  </div>
                </div>
              </div>

              <div className="recipients-section">
                <div className="recipients-header">
                  <h2>Select Recipients</h2>
                  <div className="filter-controls">
                    <div className="department-filter">
                      <label htmlFor="department">Department:</label>
                      <select
                        id="department"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        {uniqueDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="select-all-btn"
                      onClick={handleSelectAll}
                    >
                      {selectedEmployees.length === employees.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                </div>

                {loadingEmployees ? (
                  <p>Loading employees...</p>
                ) : (
                  <div className="employees-list">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className={`employee-item ${
                          selectedEmployees.includes(employee.id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleEmployeeSelect(employee.id)}
                      >
                        <div className="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            readOnly
                          />
                        </div>
                        <div className="employee-info">
                          <div className="employee-name">{employee.name}</div>
                          <div className="employee-detail">
                            {employee.department} • {employee.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="notification-actions">
              <div className="selected-count">
                Selected: <span>{selectedEmployees.length}</span> employees
              </div>
              <button
                className={`send-btn ${isLoading ? "loading" : ""}`}
                onClick={sendNotification}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Notification"}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </div>

          {/* Pending Leaves Section - Now full width */}
        </div>
        <div className="dashboard__leaves-container dashboard__full-width">
          <div className="dashboard__card">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">
                <CalendarClock className="dashboard__section-icon" />
                Pending Leave Requests
              </h2>
              <button
                className="dashboard__view-all-btn"
                onClick={() => navigate("leave-management/leave-requests")}
              >
                View All
              </button>
            </div>
            <div className="dashboard__leaves-list">
              {pendingLeaves.length > 0 ? (
                pendingLeaves.map((leave) => (
                  <div key={leave.id} className="dashboard__leave-item">
                    <div
                      className="dashboard__leave-content"
                      onClick={() =>
                        navigate("/leave-management/leave-requests")
                      }
                    >
                      <img
                        src={leave?.employee?.avatar}
                        alt={leave?.name}
                        className="dashboard__leave-avatar"
                      />
                      <div className="dashboard__leave-details">
                        <div className="dashboard__leave-header">
                          <h3 className="dashboard__leave-employee">
                            {leave?.name}
                          </h3>
                          <span
                            className={`dashboard__leave-type ${getLeaveTypeColor(
                              leave.type
                            )}`}
                          >
                            {leave.type}
                          </span>
                        </div>
                        <p className="dashboard__leave-department">
                          {leave?.department}
                        </p>
                        <div className="dashboard__leave-dates">
                          <p className="dashboard__leave-duration">
                            {leave?.duration}
                          </p>
                          <p className="dashboard__leave-period">
                            <Calendar className="dashboard__icon-tiny" />
                            {format(new Date(leave.startDate), "MMM d")} -{" "}
                            {format(new Date(leave.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        <p className="dashboard__leave-reason">
                          {leave?.reason}
                        </p>
                        <div className="dashboard__leave-footer">
                          <p className="dashboard__leave-requested">
                            Requested{" "}
                            {format(
                              new Date(leave?.appliedOn),
                              "MMM d, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard__leave-actions">
                      <button
                        className="dashboard__leave-action-reject"
                        onClick={() =>
                          handleFinalDecision(leave.id, "rejected")
                        }
                        title="Reject"
                      >
                        <X className="dashboard__icon-action" />
                      </button>
                      <button
                        className="dashboard__leave-action-approve"
                        onClick={() =>
                          handleFinalDecision(leave.id, "approved")
                        }
                        title="Approve"
                      >
                        <Save className="dashboard__icon-action" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="dashboard__no-data">No pending leave requests</p>
              )}
            </div>
          </div>
          <div className="dashboard__card">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">
                <Clock className="dashboard__section-icon" />
                Overtime Requests
              </h2>
              <button
                className="dashboard__view-all-btn"
                onClick={() => navigate("leave-management/overtime-requests")}
              >
                View All
              </button>
            </div>
            <div className="dashboard__leaves-list">
              {overtimeRequests.length > 0 ? (
                overtimeRequests.map((overtime) => (
                  <div key={overtime.id} className="dashboard__leave-item">
                    <div
                      className="dashboard__leave-content"
                      onClick={() =>
                        navigate("/leave-management/overtime-requests")
                      }
                    >
                      <img
                        src={overtime?.employee?.avatar}
                        alt={overtime?.name}
                        className="dashboard__leave-avatar"
                      />
                      <div className="dashboard__leave-details">
                        <div className="dashboard__leave-header">
                          <h3 className="dashboard__leave-employee">
                            {overtime?.name}
                          </h3>
                          <span className="dashboard__leave-type dashboard__leave-type--overtime">
                            {overtime.hours} hours
                          </span>
                        </div>
                        <p className="dashboard__leave-department">
                          {overtime?.department}
                        </p>
                        <div className="dashboard__leave-dates">
                          <p className="dashboard__leave-period">
                            <Calendar className="dashboard__icon-tiny" />
                            {format(new Date(overtime.date), "MMM d, yyyy")}
                          </p>
                          <p className="dashboard__leave-time">
                            <Clock className="dashboard__icon-tiny" />
                            {overtime.timeRange}
                          </p>
                        </div>
                        <p className="dashboard__leave-reason">
                          {overtime?.reason}
                        </p>
                        <div className="dashboard__leave-footer">
                          <p className="dashboard__leave-requested">
                            Requested{" "}
                            {format(
                              new Date(overtime?.appliedOn),
                              "MMM d, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard__leave-actions">
                      <button
                        className="dashboard__leave-action-reject"
                        onClick={() =>
                          handleOvertimeDecision(overtime.id, "rejected")
                        }
                        title="Reject"
                      >
                        <X className="dashboard__icon-action" />
                      </button>
                      <button
                        className="dashboard__leave-action-approve"
                        onClick={() =>
                          handleOvertimeDecision(overtime.id, "approved")
                        }
                        title="Approve"
                      >
                        <Save className="dashboard__icon-action" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="dashboard__no-data">No overtime requests</p>
              )}
            </div>
          </div>
        </div>
        {/* Modals */}
        <AddCardModal
          isOpen={isAddCardModalOpen}
          onClose={() => setIsAddCardModalOpen(false)}
          onAddCard={handleAddCard}
          availableCards={getAvailableCards(selectedGroupForCard)}
          selectedGroupId={selectedGroupForCard}
        />

        <AddGroupModal
          isOpen={isAddGroupModalOpen}
          onClose={() => setIsAddGroupModalOpen(false)}
          onAddGroup={handleAddGroup}
        />
      </div>
    </DndProvider>
  );
};

export default Dashboard;
