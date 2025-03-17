const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function deleteAllData() {
  try {
    console.log("Deleting all data...");

    // Delete in reverse order to prevent relation constraints
    await prisma.additionalResource.deleteMany({});
    await prisma.videoLecture.deleteMany({});
    await prisma.courseMaterial.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.participant.deleteMany({});
    await prisma.training.deleteMany({});
    await prisma.trainer.deleteMany({});
    await prisma.employee.deleteMany({});

    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
deleteAllData();
