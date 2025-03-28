// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const jwt = require('jsonwebtoken');
// const notificationRoutes = require('./routes/notificationRoutes');
// const redisClient = require('./config/redis');
// const { consumer } = require('./config/kafka');

// dotenv.config();

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Middleware: Authenticate WebSocket connections
// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token; // Retrieve token from handshake
//   if (!token) {
//     return next(new Error("Authentication error: No token provided"));
//   }
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.userId = decoded.id; // Attach user ID to socket
//     next();
//   } catch (error) {
//     return next(new Error("Authentication error: Invalid token"));
//   }
// });

// io.on('connection', (socket) => {
//   console.log(`Client connected: ${socket.id} (User ID: ${socket.userId})`);
//   socket.join(socket.userId);

//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id} (User ID: ${socket.userId})`);
//   });
// });

// // Kafka Consumer Processing
// async function startConsumer() {
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log(`Received message on topic ${topic}:`, message.value.toString());

//       try {
//         const notification = JSON.parse(message.value.toString());
//         console.log("Notification processed:", notification);

//         io.to(notification.userId).emit('notification', notification);

//       } catch (error) {
//         console.error("Error processing message:", error);
//       }
//     },
//   });
// }

// startConsumer().catch(console.error);

// app.use('/ns/api/notifications', notificationRoutes);
// app.get("/ns", (req, res) => {
//   res.status(200).json({ status: "ok", message: `Service is healthy` });
// });

// const PORT = process.env.PORT || 5002;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const notificationRoutes = require('./routes/notificationRoutes');
const redisClient = require('./config/redis');
const { consumer } = require('./config/kafka');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  path: "/ns/socket.io",
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: Authenticate WebSocket connections
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.log("No token provided.....");
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id} (User ID: ${socket?.userId})`);
  socket.join(socket.userId);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id} (User ID: ${socket.userId})`);
  });
});

// ✅ FIX: Subscribe before running consumer
async function startConsumer() {
  try {
    await consumer.connect();
    console.log("✅ Kafka Consumer connected");

    await consumer.subscribe({ topic: "notification_events", fromBeginning: false });
    console.log("✅ Subscribed to topic: notification_events");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`📩 Received message on topic ${topic}:`, message.value.toString());

        try {
          const notification = JSON.parse(message.value.toString());
          console.log("✅ Notification processed:", notification);

          // Emit notification to user via WebSocket
          io.to(notification.userId).emit("notification", notification);

        } catch (error) {
          console.error("❌ Error processing message:", error);
        }
      },
    });
  } catch (error) {
    console.error("❌ Kafka Consumer error:", error);
  }
}

// Start Kafka Consumer
startConsumer().catch(console.error);

app.use('/ns/api/notifications', notificationRoutes);
app.get("/ns", (req, res) => {
  res.status(200).json({ status: "ok", message: `Service is healthy` });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
