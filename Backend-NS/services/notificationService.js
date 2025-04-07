const { PrismaClient } = require('@prisma/client');
const redisClient = require('../config/redis');
const { producer } = require('../config/kafka');
const { ObjectId } = require('mongodb');

const axios = require("axios");

const prisma = new PrismaClient();

// export const createNotification = async (userIds, type="MANUAL", title, message, priority = 'NORMAL', sourceId = null, sourceType = null) => {
//   try {
//     console.log("Creating notifications...",userIds,type, title, message, priority);

//     if (!Array.isArray(userIds)) {
//       throw new Error('userIds must be an array');
//     }

//     // Convert userId and sourceId to ObjectId
//     const notificationsData = userIds.map(userId => ({
//       userId,
//       type,
//       title,
//       message,
//       priority,
//       sourceId: sourceId ? new ObjectId(sourceId) : null,
//       sourceType,
//       status: "UNREAD",
//       createdAt: new Date()
//     }));

//     // Store in MongoDB
//     await prisma.notification.createMany({ data: notificationsData });

//     // Store in Redis (individual entries for each user)
//     await Promise.all(notificationsData.map(notification =>
//       redisClient.lPush(`notifications:${notification.userId}`, JSON.stringify(notification))
//     ));

    // Publish to Kafka
    // await producer.send({
    //   topic: 'notification_events',
    //   messages: notificationsData.map(notification => ({ value: JSON.stringify(notification) }))
    // });

//     console.log("Notifications created successfully.");
//     return notificationsData;

//   } catch (error) {
//     console.error("Error creating notification:", error);
//     throw error;
//   }
// };




const createNotification = async (
  userIds, 
  type = "MANUAL", 
  title, 
  message, 
  priority = 'NORMAL', 
  sourceId = null, 
  sourceType = null,
  redirectUrl="#",
  recipientType="EMPLOYEE"
) => {
  try {
    console.log("Creating notifications...", userIds, type, title, message, priority);

    if (!Array.isArray(userIds)) {
      throw new Error('userIds must be an array');
    }


    // Convert sourceId to ObjectId if present
    const notificationsData = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      priority,
      sourceId: sourceId ? new ObjectId(sourceId) : null,
      sourceType,
      status: "UNREAD",
      redirectUrl,
      recipientType,
      createdAt: new Date(),
    }));

    // Store in MongoDB and get the inserted notifications
    const createdNotifications = await prisma.notification.createMany({
      data: notificationsData,
    });

    // Fetch the inserted notifications (to get their IDs)
    const insertedNotifications = await prisma.notification.findMany({
      where: { 
        userId: { in: userIds },
        status: "UNREAD",
        type,
        title,
        message
      },
      orderBy: { createdAt: "desc" }
    });

    // Store in Redis (individual entries for each user)
    await Promise.all(insertedNotifications.map(notification =>
      redisClient.lPush(`notifications:${notification.userId}`, JSON.stringify(notification))
    ));
    // Publish to Kafka
    await producer.send({
      topic: 'notification_events',
      messages: notificationsData.map(notification => ({ value: JSON.stringify(notification) }))
    });
    console.log("Notifications created successfully.");
    return insertedNotifications;

  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};











// export const getNotifications = async (userId) => {
//   try {
//     // Check Redis cache first
//     const cached = await redisClient.lRange(`notifications:${userId}`, 0, -1);
//     if (cached.length) {
//       console.log("Responding from the redis");
//       return cached.map(JSON.parse);
//     }
//     // Fetch from MongoDB using `userId` as a string (NO ObjectId conversion)
//     return await prisma.notification.findMany({
//       where: { userId }, // ✅ Use `userId` directly as a string
//       orderBy: { createdAt: 'desc' },
//     });

//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     throw error;
//   }
// };


const getNotifications = async (userId) => {
  try {
    // Check Redis cache first
    const cached = await redisClient.lRange(`notifications:${userId}`, 0, -1);
    if (cached.length) {
      console.log("Responding from Redis");
      console.log(cached);
      return cached
        .map(JSON.parse)
        .filter(notification => notification.status === "UNREAD"); // ✅ Filter unread notifications
    }

    // Fetch from MongoDB using `userId` as a string and filter by UNREAD status
    return await prisma.notification.findMany({
      where: {
        userId,
        status: "UNREAD", // ✅ Fetch only UNREAD notifications
      },
      orderBy: { createdAt: "desc" },
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// export const markAsRead = async (id) => {
//   try {
//     console.log(id);
//     const updatedNotification = await prisma.notification.update({
//       where: { id }, // ✅ Use `id` as a string (NO ObjectId conversion)
//       data: { status: 'READ', readAt: new Date() },
//     });
//     console.log("updated notification",updatedNotification)
//     // Update Redis cache (remove unread notification)
//     await redisClient.lRem(`notifications:${updatedNotification.userId}`, 1, JSON.stringify(updatedNotification));

//     return updatedNotification;

//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     throw error;
//   }
// };


const markAsRead = async (id) => {
  try {
    console.log(id);

    // Step 1: Fetch the original notification (to remove it from Redis)
    const originalNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!originalNotification) {
      throw new Error("Notification not found");
    }

    // Step 2: Remove the unread notification from Redis
    const data=await redisClient.lRem(
      `notifications:${originalNotification.userId}`, 
      1, 
      JSON.stringify(originalNotification) // Remove original unread version
    );

    console.log("this is data",data);

    // Step 3: Update the notification in the database
    const updatedNotification = await prisma.notification.update({
      where: { id }, 
      data: { status: 'READ', readAt: new Date() },
    });

    console.log("Updated notification", updatedNotification);

    return updatedNotification;

  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};


// const EMPLOYEE_SERVICE_URL = "http://employee-service/api/employees/count";
// const LEAVE_SERVICE_URL = "http://leave-service/api/leaves";
// const ATTENDANCE_SERVICE_URL = "http://attendance-service/api/attendance/active";

// const getDashboardStats = async () => {
//   try {
//     const [totalEmployeesRes, onLeaveRes, pendingLeavesRes, activeEmployeesRes] = await Promise.all([
//       axios.get(`${EMPLOYEE_SERVICE_URL}`), // Total employees
//       axios.get(`${LEAVE_SERVICE_URL}/on-leave-today`), // Employees on leave today
//       axios.get(`${LEAVE_SERVICE_URL}/pending`), // Pending leave requests
//       axios.get(`${ATTENDANCE_SERVICE_URL}`), // Active employees (punched in)
//     ]);

//     const stats = {
//       totalEmployees: totalEmployeesRes.data.count, // Assuming response has { count: number }
//       onLeaveToday: onLeaveRes.data.count, // Assuming response has { count: number }
//       pendingLeaves: pendingLeavesRes.data.count, // Assuming response has { count: number }
//       activeEmployees: activeEmployeesRes.data.count, // Assuming response has { count: number }
//     };

//     return stats;
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error);
//     throw error;
//   }
// };

// // Example usage
// getDashboardStats().then(console.log).catch(console.error);



module.exports = {
  createNotification,
  getNotifications,
  markAsRead
};