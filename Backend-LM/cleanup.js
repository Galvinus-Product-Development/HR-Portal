const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteOldLeaveRequests() {
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0); // Start of yesterday

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999); // End of yesterday

    try {
        const result = await prisma.leaveRequest.deleteMany({
            where: {
                status: { in: ['PENDING', 'REJECTED'] },
                appliedOn: { gte: yesterdayStart, lte: yesterdayEnd } // Yesterday's records
            }
        });
        console.log(`Cleanup: Deleted ${result.count} leave requests generated yesterday.`);
    } catch (error) {
        console.error("Cleanup error:", error);
    }
}

// ✅ Run cleanup job at 10:30 AM daily
cron.schedule('30 10 * * *', deleteOldLeaveRequests);

// ✅ Run cleanup when the server starts (in case of downtime)
deleteOldLeaveRequests();
