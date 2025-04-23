const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require("axios");
require("dotenv").config();
exports.addEmployee = async (employeeData) => {
    return await prisma.employee.create({ data: employeeData });
};


exports.updateEmployee = async (id, updateData) => {
    return await prisma.employee.update({ where: { id }, data: updateData });
};

exports.deleteEmployee = async (id) => {
    return await prisma.employee.delete({ where: { id } });
};


exports.getAllEmployees = async () => {
    try {
        const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL;
        if (!employeeServiceUrl) {
            throw new Error("EMPLOYEE_SERVICE_URL is not defined in .env");
        }

        // Fetch employees from the other microservice
        const { data: employees } = await axios.get(employeeServiceUrl);
        console.log(employees);
        // Fetch attendance & stats from this service
        const employeeIds = employees?.data?.map(emp => emp.id);
        const attendanceRecords = await prisma.attendance.findMany({
            where: { employeeId: { in: employeeIds } }
        });
        const monthlyAttendanceStats = await prisma.monthlyAttendanceStats.findMany({
            where: { employeeId: { in: employeeIds } }
        });

        // Merge data
        const enrichedEmployees = employees?.data?.map(emp => ({
            ...emp,
            attendance: attendanceRecords.filter(att => att.employeeId === emp.id),
            monthlyAttendanceStats: monthlyAttendanceStats.filter(stat => stat.employeeId === emp.id)
        }));

        return enrichedEmployees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw new Error("Failed to fetch employees");
    }
};





exports.getEmployee = async (id) => {
    try {
        console.log("Fetching employee details...");

        // Fetch employee from the Employee Microservice
        const employeeServiceUrl = `${process.env.EMPLOYEE_SERVICE_URLL}/${id}`;
        const { data: employee } = await axios.get(employeeServiceUrl);

        if (!employee) {
            throw new Error("Employee not found");
        }

        // Fetch attendance and monthlyAttendanceStats from this service
        const attendance = await prisma.attendance.findMany({ where: { employeeId: id } });
        const monthlyAttendanceStats = await prisma.monthlyAttendanceStats.findMany({ where: { employeeId: id } });

        // Merge the data
        const enrichedEmployee = {
            ...employee,
            attendance,
            monthlyAttendanceStats,
        };

        return enrichedEmployee;
    } catch (error) {
        console.error("Error fetching employee data:", error);
        throw new Error("Failed to fetch employee data.");
    }
};
