import { PrismaClient } from '@prisma/client';
import redisClient from '../config/redis.js';
import { producer } from '../config/kafka.js';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

export const createNotification = async (userIds, type="MANUAL", title, message, priority = 'NORMAL', sourceId = null, sourceType = null) => {
  try {
    console.log("Creating notifications...",userIds,type, title, message, priority);

    if (!Array.isArray(userIds)) {
      throw new Error('userIds must be an array');
    }

    // Convert userId and sourceId to ObjectId
    const notificationsData = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      priority,
      sourceId: sourceId ? new ObjectId(sourceId) : null,
      sourceType,
      createdAt: new Date()
    }));

    // Store in MongoDB
    await prisma.notification.createMany({ data: notificationsData });

    // Store in Redis (individual entries for each user)
    await Promise.all(notificationsData.map(notification =>
      redisClient.lPush(`notifications:${notification.userId}`, JSON.stringify(notification))
    ));

    // Publish to Kafka
    await producer.send({
      topic: 'notification_events',
      messages: notificationsData.map(notification => ({ value: JSON.stringify(notification) }))
    });

    console.log("Notifications created successfully.");
    return notificationsData;

  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};


export const getNotifications = async (userId) => {
  try {
    // Check Redis cache first
    const cached = await redisClient.lRange(`notifications:${userId}`, 0, -1);
    if (cached.length) {
      console.log("Responding from the redis");
      return cached.map(JSON.parse);
    }
    // Fetch from MongoDB using `userId` as a string (NO ObjectId conversion)
    return await prisma.notification.findMany({
      where: { userId }, // ✅ Use `userId` directly as a string
      orderBy: { createdAt: 'desc' },
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    const objectId = new ObjectId(id);

    const updatedNotification = await prisma.notification.update({
      where: { id: objectId },
      data: { status: 'READ', readAt: new Date() },
    });

    // Update Redis cache (remove unread notification)
    await redisClient.lRem(`notifications:${updatedNotification.userId}`, 1, JSON.stringify(updatedNotification));

    return updatedNotification;

  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
