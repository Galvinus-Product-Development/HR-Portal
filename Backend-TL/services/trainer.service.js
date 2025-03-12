const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllTrainers = async () => {
  return await prisma.trainer.findMany({ include: { trainings: true } });
};

exports.getTrainerById = async (id) => {
  return await prisma.trainer.findUnique({
    where: { id },
    include: { trainings: true },
  });
};

exports.createTrainer = async (data) => {
  return await prisma.trainer.create({ data });
};

exports.updateTrainer = async (id, data) => {
  return await prisma.trainer.update({ where: { id }, data });
};

exports.deleteTrainer = async (id) => {
  return await prisma.trainer.delete({ where: { id } });
};
