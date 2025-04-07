const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUnapprovedPersonalDetails = async () => {
  try {
    const unapprovedSubmissions = await prisma.personalDetailsSubmission.findMany({
      where: { approval_status: "PENDING" },
      include: {
        emergencyContacts: true,
        documents: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      success: true,
      data: unapprovedSubmissions,
    };
  } catch (error) {
    console.error("Error fetching unapproved personal details:", error);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

exports.getUnapprovedPersonalDetailsById = async (userId) => {
  try {
    const submission = await prisma.personalDetailsSubmission.findFirst({
      where: { user_id: userId },
      include: {
        emergencyContacts: true,
        documents: true,
      },
    });

    if (!submission || submission.approval_status !== "PENDING") {
      return {
        success: true,
        status: 200,
        error: "No pending submission found for this user.",
      };
    }

    return {
      success: true,
      data: submission,
    };
  } catch (error) {
    console.error("Error fetching personal details by ID:", error);
    return {
      success: false,
      status: 500,
      error: "Internal Server Error",
    };
  }
};

