const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken"); // Import JWT

exports.participantsEnroll = async (req, res) => {
  const { trainingId, signedUserId } = req.body;

  try {
    // Validate trainingId
    if (!trainingId || !ObjectId.isValid(trainingId)) {
      return res.status(400).json({ error: "Invalid training ID" });
    }

    // Verify and decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
    } catch (error) {
      console.log("JWT Verification Error:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const employeeId = decoded.userId; // Extract userId from token payload

    if (!employeeId) {
      return res.status(401).json({ error: "Unauthorized: Invalid user ID in token" });
    }

    // Check if the participant is already enrolled
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        employeeId: employeeId,
        trainingId: trainingId,
      },
    });

    if (existingParticipant) {
      return res.status(400).json({ error: "User already enrolled in this training" });
    }

    // Create Participant entry
    const participant = await prisma.participant.create({
      data: {
        employeeId: employeeId,  // Use extracted ID, not a random one
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
