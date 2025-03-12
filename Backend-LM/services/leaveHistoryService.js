const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllLeaveHistory = async (query) => {
    // const { year, month, status } = query;
    const { year, month } = query;
    const whereClause = {};

    // If year and month are provided, filter records by appliedOn date range
    if (year && month) {
        const y = Number(year);
        const m = Number(month);
        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 1);
        whereClause.appliedOn = {
            gte: startDate,
            lt: endDate,
        };
    }

    // Filter by status if provided (assuming status stored in uppercase)
    // if (status && status !== 'all') {
    //     whereClause.status = status.toUpperCase();
    // }

    return await prisma.leaveHistory.findMany({
        where: whereClause,
    });
};

exports.getLeaveHistoryById = async (id) => {
    return await prisma.leaveHistory.findUnique({
        where: { id },
    });
};

exports.getEmployeeLeaveHistoryForMonth = async (employeeId, year, month) => {
    const y = Number(year);
    const m = Number(month);
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 1);

    return await prisma.leaveHistory.findMany({
        where: {
            employee: {
                employeeId: String(employeeId),
            },
            appliedOn: {
                gte: startDate,
                lt: endDate,
            },
        },
        include: { employee: true },
    });
};

exports.createLeaveHistory = async (leaveHistoryData) => {
    return await prisma.leaveHistory.create({
        data: leaveHistoryData,
    });
};

exports.updateLeaveHistory = async (id, updateData) => {
    return await prisma.leaveHistory.update({
        where: { id },
        data: updateData,
    });
};

exports.deleteLeaveHistory = async (id) => {
    return await prisma.leaveHistory.delete({
        where: { id },
    });
};
