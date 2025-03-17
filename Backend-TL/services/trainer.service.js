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

exports.createTrainer = async (dataa) => {
  trainer = await prisma.trainer.create({
    data: {
      id: dataa.trainerId,
      name: dataa.trainerName || "Unknown Trainer",
      email: dataa.trainerEmail || `trainer@${trainerId}example.com`,
      phone: dataa.trainerPhone || "0000000000",
      expertise: dataa.trainerExpertise || "Unknown",
    },
  });
  return trainer;
};

exports.updateTrainer = async (id, data) => {
  return await prisma.trainer.update({ where: { id }, data });
};

exports.deleteTrainer = async (id) => {
  return await prisma.trainer.delete({ where: { id } });
};
