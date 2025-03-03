import { PrismaClient } from '@prisma/client';
import redisClient from '../config/redis.js';
import { producer } from '../config/kafka.js';

const prisma = new PrismaClient();

export const createNotification = async (userId, type, title, message, priority = 'NORMAL') => {
  const notification = await prisma.notification.create({
    data: { userId, type, title, message, priority },
  });

  await redisClient.lPush(`notifications:${userId}`, JSON.stringify(notification));

  await producer.send({
    topic: 'notification_events',
    messages: [{ value: JSON.stringify(notification) }],
  });

  return notification;
};

export const getNotifications = async (userId) => {
  const cached = await redisClient.lRange(`notifications:${userId}`, 0, -1);
  if (cached.length) return cached.map(JSON.parse);

  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markAsRead = async (id) => {
  return await prisma.notification.update({
    where: { id },
    data: { status: 'READ', readAt: new Date() },
  });
};
