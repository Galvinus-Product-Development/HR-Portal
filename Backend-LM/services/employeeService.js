const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require("dotenv").config(); // Load environment variables
const axios = require("axios");


exports.addEmployee = async (employeeData) => {
    return await prisma.employee.create({ data: employeeData });
};


exports.updateEmployee = async (id, updateData) => {
    return await prisma.employee.update({ where: { id }, data: updateData });
};

exports.deleteEmployee = async (id) => {
    return await prisma.employee.delete({ where: { id } });
};




exports.getEmployee = async (employeeId) => {
    try {
        const employeeServiceUrl = `${process.env.EMPLOYEE_SERVICE_URL}/${employeeId}`;
        const { data: employee } = await axios.get(employeeServiceUrl);
        console.log("Here.....................................................................................")
        if (!employee) {
            return ({ error: "Employee not found" });
        }

        // Fetch leaveRequests and leaveHistory from this service
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: { employeeId }
        });
        const leaveHistory = await prisma.leaveHistory.findMany({
            where: { employeeId }
        });

        // Merge Data
        const enrichedEmployee = {
            ...employee,
            leaveRequests,
            leaveHistory
        };

        return enrichedEmployee;
    } catch (error) {
        console.error("Error fetching employee:", error);
        return ({ error: "Failed to fetch employee data" });
    }
};



exports.getAllEmployees = async () => {
    try {
        // Fetch all employees from the Employee Microservice
        const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URLL;
        const { data: employees } = await axios.get(employeeServiceUrl);


        console.log("this is the employeees in the lm:-",employees);


        if (!employees || employees.length === 0) {
            return ([]); // Return an empty array if no employees found
        }

        // Extract employee IDs
        const employeeIds = employees?.data?.map(emp => emp.id);

        // Fetch leaveRequests and leaveHistory for all employees from this service
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: { employeeId: { in: employeeIds } }
        });
        const leaveHistories = await prisma.leaveHistory.findMany({
            where: { employeeId: { in: employeeIds } }
        });

        // Merge Data: Attach leaveRequests and leaveHistory to each employee
        const enrichedEmployees = employees?.data?.map(emp => ({
            ...emp,
            leaveRequests: leaveRequests.filter(req => req.employeeId === emp.id),
            leaveHistory: leaveHistories.filter(hist => hist.employeeId === emp.id)
        }));

        return (enrichedEmployees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        return ({ error: "Failed to fetch employees" });
    }
};
