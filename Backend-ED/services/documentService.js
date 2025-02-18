const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createDocument = async (data) => {
  return await prisma.document.create({ data });
};

exports.getAllDocuments = async () => {
  return await prisma.document.findMany();
};

exports.getDocumentById = async (documentId) => {
  return await prisma.document.findUnique({
    where: { document_id: documentId },
  });
};

exports.updateDocument = async (documentId, data) => {
  return await prisma.document.update({
    where: { document_id: documentId },
    data,
  });
};

exports.deleteDocument = async (documentId) => {
  return await prisma.document.delete({
    where: { document_id: documentId },
  });
};
