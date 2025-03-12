const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addEmployee = async (employeeData) => {
    return await prisma.employee.create({ data: employeeData });
};

exports.getAllEmployees = async () => {
    return await prisma.employee.findMany({ include: { leaveRequests: true, leaveHistory: true } });
};

exports.getEmployee = async (employeeId) => {
    return await prisma.employee.findUnique({ where: { employeeId } });
};

exports.updateEmployee = async (id, updateData) => {
    return await prisma.employee.update({ where: { id }, data: updateData });
};

exports.deleteEmployee = async (id) => {
    return await prisma.employee.delete({ where: { id } });
};
