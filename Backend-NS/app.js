import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import notificationRoutes from './routes/notificationRoutes.js';
import redisClient from './config/redis.js';
// import { consumer } from './config/kafka.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware: Authenticate WebSocket connections
io.use((socket, next) => {
  const token = socket.handshake.auth?.token; // Retrieve token from handshake
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id; // Attach user ID to socket
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
});



io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id} (User ID: ${socket.userId})`);

  socket.join(socket.userId);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id} (User ID: ${socket.userId})`);
  });
});


// await consumer.run({
//   eachMessage: async ({ topic, partition, message }) => {
//     console.log(`Received message on topic ${topic}:`, message.value.toString());

//     try {
//       const notification = JSON.parse(message.value.toString());
//       console.log("Notification processed:", notification);

//       // 🔥 Fix: Handle single userId correctly
//       io.to(notification.userId).emit('notification', notification);

//     } catch (error) {
//       console.error("Error processing message:", error);
//     }
//   },
// });


app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));