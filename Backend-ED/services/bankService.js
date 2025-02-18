const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createBank = async (data) => {
  return await prisma.bank.create({ data });
};

exports.getAllBanks = async () => {
  return await prisma.bank.findMany();
};

exports.getBankById = async (bankId) => {
  return await prisma.bank.findUnique({
    where: { bank_id: bankId },
  });
};

exports.updateBank = async (bankId, data) => {
  return await prisma.bank.update({
    where: { bank_id: bankId },
    data,
  });
};

exports.deleteBank = async (bankId) => {
  return await prisma.bank.delete({
    where: { bank_id: bankId },
  });
};
