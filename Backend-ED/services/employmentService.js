const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createEmployment = async (data) => {
  return await prisma.employment.create({ data });
};

exports.getAllEmployments = async () => {
  return await prisma.employment.findMany();
};

exports.getEmploymentById = async (employmentId) => {
  return await prisma.employment.findUnique({
    where: { employee_id: employmentId },
  });
};

exports.updateEmployment = async (employmentId, data) => {
  return await prisma.employment.update({
    where: { employee_id: employmentId },
    data,
  });
};

exports.deleteEmployment = async (employmentId) => {
  return await prisma.employment.delete({
    where: { employee_id: employmentId },
  });
};
