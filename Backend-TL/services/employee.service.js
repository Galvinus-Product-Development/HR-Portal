const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Service to add a new employee
exports.addEmployee = async (employeeData) => {
  try {
    const employee = await prisma.employee.create({
      data: employeeData,
    });
    return employee;
  } catch (error) {
    throw new Error("Error adding employee: " + error.message);
  }
};

// Service to get all employees
exports.getAllEmployees = async () => {
  try {
    const employees = await prisma.employee.findMany();
    return employees;
  } catch (error) {
    throw new Error("Error fetching employees: " + error.message);
  }
};

// Service to get an employee by ID
exports.getEmployeeById = async (id) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });
    return employee;
  } catch (error) {
    throw new Error("Error fetching employee: " + error.message);
  }
};

// Service to update an employee
exports.updateEmployee = async (id, employeeData) => {
  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: employeeData,
    });
    return updatedEmployee;
  } catch (error) {
    throw new Error("Error updating employee: " + error.message);
  }
};

// Service to delete an employee
exports.deleteEmployee = async (id) => {
  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { id: parseInt(id) },
    });
    return deletedEmployee;
  } catch (error) {
    throw new Error("Error deleting employee: " + error.message);
  }
};
