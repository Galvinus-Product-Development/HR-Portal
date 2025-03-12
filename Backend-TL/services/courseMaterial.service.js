const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllCourseMaterials = async () => {
  return await prisma.courseMaterial.findMany({
    include: {
      training: true,
    },
  });
};

exports.getCourseMaterialById = async (id) => {
  return await prisma.courseMaterial.findUnique({
    where: { id },
    include: {
      training: true,
    },
  });
};

exports.createCourseMaterial = async (data) => {
  return await prisma.courseMaterial.create({ data });
};

exports.updateCourseMaterial = async (id, data) => {
  return await prisma.courseMaterial.update({ where: { id }, data });
};

exports.deleteCourseMaterial = async (id) => {
  return await prisma.courseMaterial.delete({ where: { id } });
};
