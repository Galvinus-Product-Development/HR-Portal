const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
require("./cleanup");

// Import Routes
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');
const leaveHistoryRoutes = require('./routes/leaveHistoryRoutes');
const leavePolicyRoutes = require('./routes/leavePolicyRoutes');
const leaveBalanceRoutes = require('./routes/leaveBalanceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the uploads folder (to access uploaded PDFs)
app.use('/api/upload', express.static('./uploads'));

// Mount Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/leave-history', leaveHistoryRoutes);
app.use('/api/leave-policies', leavePolicyRoutes);
app.use('/api/leave-balance', leaveBalanceRoutes);
app.use('/api/upload-leave-request-docs', uploadRoutes);

// Handle Prisma disconnection on app termination
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
