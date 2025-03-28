const express = require("express");
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../services/notificationService");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Route to get dashboard stats
router.get("/dashboard-stats", async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userIds, type, title, message, priority } = req.body;
    const notification = await createNotification(
      userIds,
      type,
      title,
      message,
      priority
    );
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    console.log("I got upto here...", req.params.userId);
    const notifications = await getNotifications(req.params.userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const EMPLOYEE_SERVICE_URL = `${process.env.EMPLOYEE_SERVICE_URL}`;

const LEAVE_SERVICE_URL = `${process.env.LEAVE_SERVICE_URL}`;
const ATTENDANCE_SERVICE_URL = `${process.env.ATTENDANCE_SERVICE_URL}`;

console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6",ATTENDANCE_SERVICE_URL);

const getDashboardStats = async () => {
  try {
    const [
      totalEmployeesRes,
      onLeaveRes,
      pendingLeavesRes,
      activeEmployeesRes,
    ] = await Promise.all([
      axios.get(`${EMPLOYEE_SERVICE_URL}`), // Total employees

      axios.get(`${LEAVE_SERVICE_URL}`), // Employees on leave today
      0, // Pending leave requests
      axios.get(`${ATTENDANCE_SERVICE_URL}`), // Active employees (punched in)
    ]);
    console.log("this is on leave :-  ", onLeaveRes.data.count);
    const stats = {
      totalEmployees: totalEmployeesRes.data.data.length, // Assuming response has { count: number }
      onLeaveToday: onLeaveRes.data.count, // Assuming response has { count: number }
      pendingLeaves: pendingLeavesRes, // Assuming response has { count: number }
      activeEmployees: activeEmployeesRes.data.count, // Assuming response has { count: number }
    };
    console.log(stats);
    return stats;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

module.exports = router;
