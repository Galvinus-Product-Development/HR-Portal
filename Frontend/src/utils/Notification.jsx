import { useState, useEffect } from "react";
import "./Notification.css"; // Import the CSS file

const Notification = ({ message, type = "info", onClose }) => {
  const [isVisible, setIsVisible] = useState(false); // Initially false

  useEffect(() => {
    if (!message) return; // Prevent unnecessary execution

    setIsVisible(true); // Show animation

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Allow fade-out animation to complete
    }, 10000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500);
  };

  // Instead of returning null, render an empty div
  if (!message) return <div className="hidden"></div>;

  return (
    <div className={`notification ${type} ${isVisible ? "visible" : "hidden"}`}>
      <div className="notification-message">{message}</div>
      <button 
        onClick={handleClose}
        className="notification-close"
        aria-label="Close notification"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default Notification;
