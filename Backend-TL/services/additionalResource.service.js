const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllResources = async () => {
  return await prisma.additionalResource.findMany({
    include: {
      training: true,
    },
  });
};

exports.getResourceById = async (id) => {
  return await prisma.additionalResource.findUnique({
    where: { id },
    include: {
      training: true,
    },
  });
};

exports.createResource = async (data) => {
  return await prisma.additionalResource.create({ data });
};

exports.updateResource = async (id, data) => {
  return await prisma.additionalResource.update({ where: { id }, data });
};

exports.deleteResource = async (id) => {
  return await prisma.additionalResource.delete({ where: { id } });
};
