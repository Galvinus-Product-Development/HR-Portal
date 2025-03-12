const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const EMPLOYEE_SERVICE_URL = "http://localhost:5001/api/employeeRoutes/formatted";

exports.addEmployee = async (employeeData) => {
    return await prisma.employee.create({ data: employeeData });
};

exports.getEmployee = async (id) => {
    // return await prisma.employee.findUnique({ where: { id } });
    // Fetch employees from Employee Microservice
    const employeeResponse = await axios.get(EMPLOYEE_SERVICE_URL);
    // console.log(employeeResponse.data);
    
    const data = employeeResponse.data;
    const employees = data.data; // Assuming API returns { data: [...] }

    if (!employees || employees.length === 0) {
        return { message: "No employees found" };
    }
    return employees;
};

// exports.getAllEmployees = async () => {
//     return await prisma.employee.findMany({ include: { attendance: true } });
// };

exports.updateEmployee = async (id, updateData) => {
    return await prisma.employee.update({ where: { id }, data: updateData });
};

exports.deleteEmployee = async (id) => {
    return await prisma.employee.delete({ where: { id } });
};






exports.getAllEmployees = async () => {
    try {
        // Fetch employees from Employee Microservice
        const employeeResponse = await axios.get(EMPLOYEE_SERVICE_URL);
        // console.log(employeeResponse.data);
        
        const data = employeeResponse.data;
        const employees = data.data; // Assuming API returns { data: [...] }

        if (!employees || employees.length === 0) {
            return { message: "No employees found" };
        }



        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        const validEmployeeIds = employees
          .map(emp => emp.id)
          .filter(id => !uuidRegex.test(id)); // Remove UUIDs
        
        if (validEmployeeIds.length === 0) {
            return { message: "No valid employee IDs found for attendance records." };
        }
        
        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                employeeId: { in: validEmployeeIds },
            },
        });



        // Extract all employee IDs
        // const employeeIds = employees.map(emp => emp.id);

        // // Fetch attendance data for these employees
        // const attendanceRecords = await prisma.attendance.findMany({
        //     where: {
        //         employeeId: { in: employeeIds },
        //     },
        // });

        // Merge employee data with attendance
        const result = employees.map(employee => ({
            ...employee,
            attendance: attendanceRecords.filter(att => att.employeeId === employee.id),
        }));

        return result;
    } catch (error) {
        console.error("Error fetching employees with attendance:", error);
        throw new Error("Failed to fetch employee and attendance data.");
    }
};