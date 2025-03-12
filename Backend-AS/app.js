const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const attendanceRoutes = require('./routes/attendanceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config(); // Load environment variables

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Mount separate routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employees', employeeRoutes);

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
