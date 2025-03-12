const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllParticipants = async () => {
  return await prisma.participant.findMany({
    include: {
      employee: true,
      training: true,
    },
  });
};

exports.getParticipantById = async (id) => {
  return await prisma.participant.findUnique({
    where: { id },
    include: {
      employee: true,
      training: true,
    },
  });
};

exports.createParticipant = async (data) => {
  return await prisma.participant.create({ data });
};

exports.updateParticipant = async (id, data) => {
  return await prisma.participant.update({ where: { id }, data });
};

exports.deleteParticipant = async (id) => {
  return await prisma.participant.delete({ where: { id } });
};
