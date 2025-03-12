const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
	const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
	try {
		const result = await prisma.leaveRequest.deleteMany({
			where: {
				status: { in: ['APPROVED', 'REJECTED'] },
				decisionAt: { lt: cutoff }
			}
		});
		console.log(`Cleanup: Deleted ${result.count} leave requests older than 24 hours.`);
	} catch (error) {
		console.error("Cleanup error:", error);
	}
});
