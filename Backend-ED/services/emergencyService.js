const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createEmergencyContact = async (data) => {
  return await prisma.emergency.create({ data });
};

exports.getAllEmergencyContacts = async () => {
  return await prisma.emergency.findMany();
};

exports.getEmergencyContactById = async (contactId) => {
  return await prisma.emergency.findUnique({
    where: { contact_id: contactId },
  });
};

exports.updateEmergencyContact = async (contactId, data) => {
  return await prisma.emergency.update({
    where: { contact_id: contactId },
    data,
  });
};

exports.deleteEmergencyContact = async (contactId) => {
  return await prisma.emergency.delete({
    where: { contact_id: contactId },
  });
};
