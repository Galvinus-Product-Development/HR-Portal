const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createHolidays = async (holidays) => {
    return prisma.holiday.createMany({ data: holidays });
}

exports.getAllHolidays = async () => {
    return prisma.holiday.findMany({ orderBy: { date: "asc"	} });
}

exports.updateHoliday = async (updatedData) => {
    return prisma.holiday.update({
        where: {
            id: updatedData.id
        },
        data: {
            date: new Date(updatedData.date),
            title: updatedData.title,
            createdAt: updatedData.createdAt,
            location: updatedData.location
        }
    });
}

exports.deleteHoliday = async (id) => {
    return prisma.holiday.delete({ where: { id } });
}