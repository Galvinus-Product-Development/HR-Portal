const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { ObjectId } = require("mongodb");

exports.participantsEnroll = async (req, res) => {
  const { trainingId, participantEmail } = req.body;

  try {
    // Find employee by email
    // const employee = await prisma.employee.findUnique({
    //   where: { email: participantEmail },
    // });

    // if (!employee) return res.status(404).json({ error: "Employee not found" });
    const randomEmployeeId = new ObjectId().toString();
    // Create Participant entry
    const participant = await prisma.participant.create({
      data: {
        employeeId: randomEmployeeId,
        trainingId,
        enrollmentDate: new Date(),
        progress: 0,
        status: "Enrolled",
      },
    });

    res.status(201).json({ message: "Enrollment successful", participant });
  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ error: "Enrollment failed" });
  }
};
