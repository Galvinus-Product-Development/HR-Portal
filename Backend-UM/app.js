const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const session = require("./config/sessionStore");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rolePermissionRoutes = require("./routes/rolePermissionRoutes");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize the app
const app = express();

// Create a write stream (in append mode) for logging to a file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);

// Middlewares
app.use(morgan("dev")); // Logs to the console in 'dev' format (for development)
app.use(morgan("combined", { stream: accessLogStream })); // Logs to a file in 'combined' format (for production)

// Set additional middlewares
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.29.199:5173/my-account"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

// Route middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// Start server after Apollo Server is set up
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await connectDB.disconnect(); // Adjust for Prisma or MongoDB
  process.exit(0);
});
