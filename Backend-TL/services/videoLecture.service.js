const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllVideoLectures = async () => {
  return await prisma.videoLecture.findMany({
    include: {
      training: true,
    },
  });
};

exports.getVideoLectureById = async (id) => {
  return await prisma.videoLecture.findUnique({
    where: { id },
    include: {
      training: true,
    },
  });
};

exports.createVideoLecture = async (data) => {
  return await prisma.videoLecture.create({ data });
};

exports.updateVideoLecture = async (id, data) => {
  return await prisma.videoLecture.update({ where: { id }, data });
};

exports.deleteVideoLecture = async (id) => {
  return await prisma.videoLecture.delete({ where: { id } });
};
