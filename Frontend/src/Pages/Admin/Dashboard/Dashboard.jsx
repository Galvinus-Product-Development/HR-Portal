// import React, { useEffect, useState } from "react";
// import { format } from "date-fns";
// import {
//   LayoutDashboard,
//   Users,
//   Calendar,
//   Cake,
//   Bell,
//   UserPlus,
//   GraduationCap,
//   CalendarClock,
//   PartyPopper,
//   AlertCircle,
//   Clock,
//   CheckCircle,
//   XCircle,
//   PauseCircle,
//   User,
// } from "lucide-react";
// import io from "socket.io-client";
// import "./Dashboard.css";
// import { useNavigate } from "react-router-dom";
// const token = localStorage.getItem("accessToken");
// const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
//   path: "/ns/socket.io", 
//   transports: ["websocket", "polling"], 
//   auth: {
//     token, // ✅ Send token for authentication
//   },
// });
// const API_BASE_URL_NS = `${import.meta.env.VITE_API_BASE_URL_NS}`;
// const API_BASE_URL_LM = `${import.meta.env.VITE_API_BASE_URL_LM}`;

// const Dashboard = () => {
//   // Mock data
//   const navigate = useNavigate();
//   const [dashboardStats, setDashboardStats] = useState({
//     totalEmployees: 0,
//     employeesOnLeave: 0,
//     pendingLeaveRequests: 0,
//     upcomingBirthdays: 0,
//   });

//   const [notifications, setNotifications] = useState([]);
//   const [pendingLeaves, setPendingLeaves] = useState([]);
//   const userId = localStorage.getItem("userId");

//   // Mock notifications data

//   // Mock pending leaves data
//   useEffect(() => {
//     // Fetch dashboard stats
//     console.log(socket.connected ? "✅ Connected" : "❌ Not Connected");
//     const fetchDashboardStats = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL_NS}/api/notifications/dashboard-stats`);
//             if (!response.ok) throw new Error('Failed to fetch dashboard stats');
//             const data = await response.json();
//             console.log("stats data:------------------------",data)
//             setDashboardStats(data);
//         } catch (error) {
//             console.error('Error fetching dashboard stats:', error);
//         }
//     };

//     // Fetch past notifications
//     const fetchNotifications = async () => {
//       console.log("We are here...");
//       try {
//         const response = await fetch(
//           `${API_BASE_URL_NS}/api/notifications/${userId}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch notifications");

//         const data = await response.json();
//         console.log("this is the notification data",data);
//         setNotifications(data);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     // Fetch pending leave requests

//     const fetchPendingLeaves = async () => {
//       try {
//         const response = await fetch(
//           `${API_BASE_URL_LM}/api/leave-requests/pending/${userId}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch pending leaves");
//         const data = await response.json();
//         console.log("this is the pending leaves",data)
//         setPendingLeaves(data);
//       } catch (error) {
//         console.error("Error fetching pending leaves:", error);
//       }
//     };

//     fetchDashboardStats();
//     fetchNotifications();
//     fetchPendingLeaves();

//     // Join user-specific WebSocket room
//     socket.emit("join", userId);

//     // Listen for new notifications
//     socket.on("notification", (notification) => {
//       console.log("New Notification:", notification);
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socket.off("notification"); // Cleanup WebSocket listener
//     };
//   }, [userId]);

//   const getNotificationColor = (priority) => {
//     switch (priority) {
//       case "high":
//         return "dashboard__notification-high";
//       default:
//         return "dashboard__notification-normal";
//     }
//   };

//   const getLeaveTypeColor = (type) => {
//     switch (type) {
//       case "Annual Leave":
//         return "dashboard__leave-annual";
//       case "Sick Leave":
//         return "dashboard__leave-sick";
//       case "Personal Leave":
//         return "dashboard__leave-personal";
//       default:
//         return "dashboard__leave-default";
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       await fetch(
//         `${API_BASE_URL_NS}/api/notifications/${id}/read`, { method: "PATCH" });

//       // Update UI Optimistically
//       setNotifications((prev) =>
//         prev.map((notification) =>
//           notification.id === id
//             ? { ...notification, status: "READ" }
//             : notification
//         )
//       );
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

  

//   const handleFinalDecision = async (id, decision) => {
//     let statusToUpdate = decision;
//     if (decision === "onHold") {
//         statusToUpdate = "ON_HOLD";
//     } else if (decision === "approved") {
//         statusToUpdate = "APPROVED";
//     } else if (decision === "rejected") {
//         statusToUpdate = "REJECTED";
//     }
//     try {
//         const response = await fetch(
//             `${API_BASE_URL_LM}/api/leave-requests/${id}`,
//             {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ status: statusToUpdate }),
//             }
//         );
//         if (!response.ok) {
//             throw new Error(
//                 `Failed to update leave request to ${statusToUpdate}`
//             );
//         } else {
//             setIsDecisionTaken((prev) => !prev);
//         }
//         // Refresh the list after update
//         // fetchLeaveRequests();
//         setIsDetailsModalOpen(false);
//     } catch (err) {
//         console.error(err);
//     }
// };

//   return (
//     <div className="dashboard__container">
//       <div className="dashboard__header">
//         <LayoutDashboard className="dashboard__header-icon" />
//         <h1 className="dashboard__header-title">Admin Dashboard</h1>
//       </div>
  
//       {/* Stats Cards */}
//       <div className="dashboard__stats-grid">
//         <div className="dashboard__stats-card">
//           <div className="dashboard__stats-card-content">
//             <div>
//               <p className="dashboard__stats-label">Total Employees</p>
//               <p className="dashboard__stats-value">
//                 {dashboardStats?.totalEmployees}
//               </p>
//             </div>
//             <div className="dashboard__stats-icon-container dashboard__stats-icon-blue">
//               <Users className="dashboard__stats-icon" />
//             </div>
//           </div>
//         </div>
  
//         <div className="dashboard__stats-card">
//           <div className="dashboard__stats-card-content">
//             <div>
//               <p className="dashboard__stats-label">On Leave Today</p>
//               <p className="dashboard__stats-value">
//                 {dashboardStats?.onLeaveToday}
//               </p>
//             </div>
//             <div className="dashboard__stats-icon-container dashboard__stats-icon-green">
//               <Calendar className="dashboard__stats-icon" />
//             </div>
//           </div>
//         </div>
  
//         <div className="dashboard__stats-card">
//           <div className="dashboard__stats-card-content">
//             <div>
//               <p className="dashboard__stats-label">Pending Leaves</p>
//               <p className="dashboard__stats-value">
//                 {dashboardStats?.pendingLeaves}
//               </p>
//             </div>
//             <div className="dashboard__stats-icon-container dashboard__stats-icon-yellow">
//               <CalendarClock className="dashboard__stats-icon" />
//             </div>
//           </div>
//         </div>
  
//         <div className="dashboard__stats-card">
//           <div className="dashboard__stats-card-content">
//             <div>
//               <p className="dashboard__stats-label">Active Employees</p>
//               <p className="dashboard__stats-value">
//                 {dashboardStats?.activeEmployees}
//               </p>
//             </div>
//             <div className="dashboard__stats-icon-container dashboard__stats-icon-purple">
//               <User className="dashboard__stats-icon" />
//             </div>
//           </div>
//         </div>
//       </div>
  
//       <div className="dashboard__main-grid">
//         {/* Notifications Section */}
//         <div className="dashboard__notifications-container">
//           <div className="dashboard__card">
//             <div className="dashboard__section-header">
//               <h2 className="dashboard__section-title">
//                 <Bell className="dashboard__section-icon" />
//                 Notifications
//               </h2>
//               <span className="dashboard__notification-count">
//                 {notifications.length} new notifications
//               </span>
//             </div>
//             <div className="dashboard__notifications-list">
//               {notifications.length > 0 ? (
//                 notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`dashboard__notification-item ${getNotificationColor(
//                       notification.priority
//                     )}`}
//                   >
//                     <div className="dashboard__notification-content">
//                       <div
//                         className={`dashboard__notification-icon ${
//                           notification.priority === "high"
//                             ? "dashboard__notification-icon-high"
//                             : "dashboard__notification-icon-normal"
//                         }`}
//                       >
//                         {notification.icon && (
//                           <notification.icon className="dashboard__icon-small" />
//                         )}
//                         <Bell className="dashboard__icon-small" />
//                       </div>
//                       <div className="dashboard__notification-text">
//                         <h3 className="dashboard__notification-title">
//                           {notification.title}
//                         </h3>
//                         <p className="dashboard__notification-message">
//                           {notification.message}
//                         </p>
//                         <p className="dashboard__notification-timestamp">
//                           {format(
//                             new Date(notification.createdAt),
//                             "MMM d, yyyy • h:mm a"
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                     {/* "Mark as Read" button */}
//                     {notification.status === "UNREAD" && (
//                       <button
//                         className="dashboard__notification-mark-read"
//                         onClick={() => {
//                           console.log("this is notification id:-", notification);
//                           markAsRead(notification.id);
//                         }}
//                       >
//                         Mark as Read
//                       </button>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className="no-notifications">No new notifications</p>
//               )}
//             </div>
//           </div>
//         </div>
  
//         {/* Pending Leaves Section */}
//         <div className="dashboard__leaves-container">
//           <div className="dashboard___card">
//             <div className="dashboard__section-header">
//               <h2 className="dashboard__section-title">
//                 <CalendarClock className="dashboard__section-icon" />
//                 Pending Leave Requests
//               </h2>
//               <button 
//                 className="dashboard__view-all-btn"
//                 onClick={() => navigate("leave-management/leave-requests")}
//               >
//                 View All
//               </button>
//             </div>
//             <div className="dashboard__leaves-list">
//               {pendingLeaves.length > 0 ? (
//                 pendingLeaves?.map((leave) => (
//                   <div key={leave.id} className="dashboard__leave-item">
//                     <div 
//                       className="dashboard__leave-content"
//                       onClick={() => navigate("/leave-management/leave-requests")}
//                     >
//                       <img
//                         src={leave?.employee?.avatar}
//                         alt={leave?.name}
//                         className="dashboard__leave-avatar"
//                       />
//                       <div className="dashboard__leave-details">
//                         <div className="dashboard__leave-header">
//                           <h3 className="dashboard__leave-employee">
//                             {leave?.name}
//                           </h3>
//                           <span
//                             className={`dashboard__leave-type ${getLeaveTypeColor(
//                               leave.type
//                             )}`}
//                           >
//                             {leave.type}
//                           </span>
//                         </div>
//                         <p className="dashboard__leave-department">
//                           {leave?.department}
//                         </p>
//                         <div className="dashboard__leave-dates">
//                           <p className="dashboard__leave-duration">
//                             {leave?.duration}
//                           </p>
//                           <p className="dashboard__leave-period">
//                             <Calendar className="dashboard__icon-tiny" />
//                             {format(new Date(leave.startDate), "MMM d")} -{" "}
//                             {format(new Date(leave.endDate), "MMM d, yyyy")}
//                           </p>
//                         </div>
//                         <p className="dashboard__leave-reason">
//                           {leave?.reason}
//                         </p>
//                         <div className="dashboard__leave-footer">
//                           <p className="dashboard__leave-requested">
//                             Requested{" "}
//                             {format(
//                               new Date(leave?.appliedOn),
//                               "MMM d, h:mm a"
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="dashboard__leave-actions">
//                       <button 
//                         className="dashboard__leave-action-reject"
//                         onClick={() => handleFinalDecision(leave.id, "rejected")}
//                         title="Reject"
//                       >
//                         <XCircle className="dashboard__icon-action" />
//                       </button>
//                       <button 
//                         className="dashboard__leave-action-hold"
//                         onClick={() => handleFinalDecision(leave.id, "onHold")}
//                         title="On Hold"
//                       >
//                         <PauseCircle className="dashboard__icon-action" />
//                       </button>
//                       <button 
//                         className="dashboard__leave-action-approve"
//                         onClick={() => handleFinalDecision(leave.id, "approved")}
//                         title="Approve"
//                       >
//                         <CheckCircle className="dashboard__icon-action" />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="no-pending-leaves">No pending leave requests</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;







import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bell,
  CalendarClock,
  User,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  // DragDropIcon,
  Folder,
  FolderPlus,
  Settings,
  Move,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import io from "socket.io-client";
import "./Dashboard.css";

const token = localStorage.getItem("accessToken");
const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
  path: "/ns/socket.io",
  transports: ["websocket", "polling"],
  auth: {
    token,
  },
});
const API_BASE_URL_NS = `${import.meta.env.VITE_API_BASE_URL_NS}`;
const API_BASE_URL_LM = `${import.meta.env.VITE_API_BASE_URL_LM}`;

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
    id: "upcomingLeaves",
    label: "Upcoming Leaves",
    icon: Calendar,
    colorClass: "dashboard__stats-icon-orange",
    dataKey: "upcomingLeaves",
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
      className={`dashboard__stats-card ${isDragging ? 'dashboard__dragging' : ''}`}
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
  index
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
      className={`dashboard__card-group ${isDragging ? 'dashboard__dragging' : ''}`}
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
            <button onClick={handleSave} className="dashboard__group-btn" title="Save">
              <Save size={16} />
            </button>
            <button onClick={() => setIsEditing(false)} className="dashboard__group-btn" title="Cancel">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="dashboard__group-title">
            <Folder size={18} className="dashboard__group-icon" />
            <h3>{group.name}</h3>
            <div className="dashboard__group-actions">
              <button onClick={() => setIsEditing(true)} className="dashboard__group-btn" title="Edit Group Name">
                <Edit size={16} />
              </button>
              <button onClick={() => onRemoveGroup(group.id)} className="dashboard__group-btn" title="Delete Group">
                <Trash2 size={16} />
              </button>
              <div className="dashboard__group-drag-handle" title="Drag to reorder">
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
const AddCardModal = ({ isOpen, onClose, onAddCard, availableCards, selectedGroupId }) => {
  const [selectedCardId, setSelectedCardId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCardId) {
      const cardTemplate = cardTemplates.find(card => card.id === selectedCardId);
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
                {availableCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="dashboard__modal-footer">
            <button type="button" onClick={onClose} className="dashboard__btn dashboard__btn-secondary">
              Cancel
            </button>
            <button type="submit" className="dashboard__btn dashboard__btn-primary" disabled={!selectedCardId}>
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
            <button type="button" onClick={onClose} className="dashboard__btn dashboard__btn-secondary">
              Cancel
            </button>
            <button type="submit" className="dashboard__btn dashboard__btn-primary" disabled={!groupName.trim()}>
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
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    pendingLeaves: 0,
    activeEmployees: 0,
    newHires: 0,
    upcomingLeaves: 0,
  });
  const [notifications, setNotifications] = useState([]);
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
        ]
      }
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
    setGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        cards: group.cards.map(card => ({
          ...card,
          value: dashboardStats[card.dataKey] || 0
        }))
      }))
    );
  }, [dashboardStats]);

  // Fetch data useEffect
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_NS}/api/notifications/dashboard-stats`);
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_NS}/api/notifications/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchPendingLeaves = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_LM}/api/leave-requests/pending/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch pending leaves");
        const data = await response.json();
        setPendingLeaves(data);
      } catch (error) {
        console.error("Error fetching pending leaves:", error);
      }
    };

    fetchDashboardStats();
    fetchNotifications();
    fetchPendingLeaves();

    // WebSocket setup
    socket.emit("join", userId);
    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  // Get available cards that aren't already used
  const getAvailableCards = (groupId) => {
    const usedCardIds = new Set();
    groups.forEach(group => {
      if (group.id === groupId) return; // Skip the current group when checking
      group.cards.forEach(card => {
        usedCardIds.add(card.id);
      });
    });
    
    return cardTemplates.filter(card => !usedCardIds.has(card.id));
  };

  // Handle adding a new card
  const handleAddCard = (cardTemplate, groupId) => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            cards: [...group.cards, { ...cardTemplate, value: dashboardStats[cardTemplate.dataKey] || 0 }]
          };
        }
        return group;
      })
    );
  };

  // Handle removing a card
  const handleRemoveCard = (cardId, groupId) => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            cards: group.cards.filter(card => card.id !== cardId)
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
      cards: []
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  // Handle removing a group
  const handleRemoveGroup = (groupId) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
  };

  // Handle renaming a group
  const handleRenameGroup = (groupId, newName) => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          return { ...group, name: newName };
        }
        return group;
      })
    );
  };

  // Handle moving a card between or within groups
  const moveCard = (fromGroupId, toGroupId, fromIndex, toIndex) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      
      // Find the source and destination groups
      const fromGroupIndex = newGroups.findIndex(g => g.id === fromGroupId);
      const toGroupIndex = newGroups.findIndex(g => g.id === toGroupId);
      
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
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const [movedGroup] = newGroups.splice(fromIndex, 1);
      newGroups.splice(toIndex, 0, movedGroup);
      return newGroups;
    });
  };

  // Helper functions for notification and leave sections
  const getNotificationColor = (priority) => {
    switch (priority) {
      case "high":
        return "dashboard__notification-high";
      default:
        return "dashboard__notification-normal";
    }
  };

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

  const markAsRead = async (id) => {
    try {
      await fetch(
        `${API_BASE_URL_NS}/api/notifications/${id}/read`, { method: "PATCH" });

      // Update UI Optimistically
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, status: "READ" }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
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
        const response = await fetch(
            `${API_BASE_URL_LM}/api/leave-requests/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: statusToUpdate }),
            }
        );
        
        if (!response.ok) {
            throw new Error(`Failed to update leave request to ${statusToUpdate}`);
        }
        
        // Refresh leaves after update
        const refreshResponse = await fetch(
          `${API_BASE_URL_LM}/api/leave-requests/pending/${userId}`
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
              className={`dashboard__edit-toggle ${isEditMode ? 'dashboard__edit-active' : ''}`}
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
        
        {/* Main Grid for Notifications and Leave Requests */}
        <div className="dashboard__main-grid">
          {/* Notifications Section */}
          <div className="dashboard__notifications-container">
            <div className="dashboard__card">
              <div className="dashboard__section-header">
                <h2 className="dashboard__section-title">
                  <Bell className="dashboard__section-icon" />
                  Notifications
                </h2>
                <span className="dashboard__notification-count">
                  {notifications.filter(n => n.status === "UNREAD").length} new notifications
                </span>
              </div>
              <div className="dashboard__notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`dashboard__notification-item ${getNotificationColor(
                        notification.priority
                      )}`}
                    >
                      <div className="dashboard__notification-content">
                        <div
                          className={`dashboard__notification-icon ${
                            notification.priority === "high"
                              ? "dashboard__notification-icon-high"
                              : "dashboard__notification-icon-normal"
                          }`}
                        >
                          <Bell className="dashboard__icon-small" />
                        </div>
                        <div className="dashboard__notification-text">
                          <h3 className="dashboard__notification-title">
                            {notification.title}
                          </h3>
                          <p className="dashboard__notification-message">
                            {notification.message}
                          </p>
                          <p className="dashboard__notification-timestamp">
                            {format(
                              new Date(notification.createdAt),
                              "MMM d, yyyy • h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                      {/* "Mark as Read" button */}
                      {notification.status === "UNREAD" && (
                        <button
                          className="dashboard__notification-mark-read"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="dashboard__no-data">No new notifications</p>
                )}
              </div>
            </div>
          </div>
  
          {/* Pending Leaves Section */}
          <div className="dashboard__leaves-container">
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
                        onClick={() => navigate("/leave-management/leave-requests")}
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
                          onClick={() => handleFinalDecision(leave.id, "rejected")}
                          title="Reject"
                        >
                          <X className="dashboard__icon-action" />
                        </button>
                        <button 
                          className="dashboard__leave-action-approve"
                          onClick={() => handleFinalDecision(leave.id, "approved")}
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