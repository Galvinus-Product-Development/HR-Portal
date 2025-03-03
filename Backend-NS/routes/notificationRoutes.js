import express from 'express';
import { createNotification, getNotifications, markAsRead } from '../services/notificationService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userIds, type, title, message, priority } = req.body;
    const notification = await createNotification(userIds, type, title, message, priority);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    console.log("I got upto here...",req.params.userId);
    const notifications = await getNotifications(req.params.userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
