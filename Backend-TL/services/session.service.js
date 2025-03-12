const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllSessions = async () => {
  return await prisma.session.findMany({
    include: {
      training: true,
    },
  });
};

exports.getSessionById = async (id) => {
  return await prisma.session.findUnique({
    where: { id },
    include: {
      training: true,
    },
  });
};

exports.createSession = async (data) => {
  return await prisma.session.create({ data });
};

exports.updateSession = async (id, data) => {
  return await prisma.session.update({ where: { id }, data });
};

exports.deleteSession = async (id) => {
  return await prisma.session.delete({ where: { id } });
};
