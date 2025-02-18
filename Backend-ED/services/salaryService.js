const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSalary = async (data) => {
  return await prisma.salary.create({ data });
};

exports.getAllSalaries = async () => {
  return await prisma.salary.findMany({
    include: { employee: true, bank: true },
  });
};

exports.getSalaryById = async (transactionId) => {
  return await prisma.salary.findUnique({
    where: { transaction_id: transactionId },
    include: { employee: true, bank: true },
  });
};

exports.updateSalary = async (transactionId, data) => {
  return await prisma.salary.update({
    where: { transaction_id: transactionId },
    data,
  });
};

exports.deleteSalary = async (transactionId) => {
  return await prisma.salary.delete({
    where: { transaction_id: transactionId },
  });
};
