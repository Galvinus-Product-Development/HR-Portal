const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const attendanceRoutes = require('./routes/attendanceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const monthlyAttendanceRoutes = require('./routes/monthlyAttendanceRoutes');
const overtimeRoutes = require('./routes/overtimeRoutes'); //-------------CHANGED HERE ----------//

dotenv.config(); // Load environment variables

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Mount separate routes
app.get("/at", (req, res) => {
  res.status(200).json({ status: "ok", message: `Service is healthy` });
});

app.use('/at/api/attendance', attendanceRoutes);
app.use('/at/api/employees', employeeRoutes);
app.use('/at/api/monthlyAttendance', monthlyAttendanceRoutes);
app.use('/at/api/overtime', overtimeRoutes);   //----CHANGED HERE -----------------//

// Handle Prisma Disconnection on Process Exit
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

// Start the Server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
