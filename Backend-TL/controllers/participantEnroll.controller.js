const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken"); // Import JWT
require("dotenv").config();
// exports.participantsEnroll = async (req, res) => {
//   const { trainingId, signedUserId } = req.body;

//   try {
//     // Validate trainingId
//     if (!trainingId || !ObjectId.isValid(trainingId)) {
//       return res.status(400).json({ error: "Invalid training ID" });
//     }

//     // Verify and decode JWT token
//     let decoded;
//     try {
//       decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
//     } catch (error) {
//       console.log("JWT Verification Error:", error);
//       return res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }

//     const employeeId = decoded.userId; // Extract userId from token payload

//     if (!employeeId) {
//       return res.status(401).json({ error: "Unauthorized: Invalid user ID in token" });
//     }

//     // Check if the participant is already enrolled
//     const existingParticipant = await prisma.participant.findFirst({
//       where: {
//         employeeId: employeeId,
//         trainingId: trainingId,
//       },
//     });

//     if (existingParticipant) {
//       return res.status(400).json({ error: "User already enrolled in this training" });
//     }

//     // Create Participant entry
//     const participant = await prisma.participant.create({
//       data: {
//         employeeId: employeeId,  // Use extracted ID, not a random one
//         trainingId,
//         enrollmentDate: new Date(),
//         progress: 0,
//         status: "Enrolled",
//       },
//     });

//     res.status(201).json({ message: "Enrollment successful", participant });
//   } catch (error) {
//     console.error("Enrollment Error:", error);
//     res.status(500).json({ error: "Enrollment failed" });
//   }
// };
const EMPLOYEE_SERVICE_URL=process.env.EMPLOYEE_SERVICE_URL;

exports.participantsEnroll = async (req, res) => {
  const { trainingId, signedUserId } = req.body;
  console.log("Here........................I am");
  try {
    if (!trainingId || !ObjectId.isValid(trainingId)) {
      return res.status(400).json({ error: "Invalid training ID" });
    }

    let decoded;
    try {
      decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
    } catch (error) {
      console.log("JWT Verification Error:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const employeeId = decoded.userId; // userId is employee_id in Employee Service

    if (!employeeId) {
      return res.status(401).json({ error: "Unauthorized: Invalid user ID in token" });
    }

    // Fetch employee details from Employee Service
    const employeeResponse = await fetch(`${EMPLOYEE_SERVICE_URL}/api/employeeRoutes/fetchEmployeeDetailsByyId/${employeeId}`);
    if (!employeeResponse.ok) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeData = await employeeResponse.json();
    console.log("employee data 111111111111111111",employeeData);

    if (!employeeData || !employeeData.personalDetails) {
      return res.status(404).json({ error: "Invalid Employee Data" });
    }


    const { name, personalEmail, employmentDetails } = employeeData.personalDetails; // CHANGE: Fetching nested values
    const department = employmentDetails?.department || "Unknown"; // CHANGE: Added fallback for department

    // Check if the employee exists in the Training DB
    let existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      // Create Employee entry in Training DB
      existingEmployee = await prisma.employee.create({
        data: {
          id: employeeId,
          name, // CHANGE: Name from Employee Service
          email: personalEmail, // CHANGE: Using personal email
          department, // CHANGE: Using department from employment details
        },
      });
      console.log("existing employee 2222222222222222222222",existingEmployee);
    }

    // Check if the participant is already enrolled
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        employeeId,
        trainingId,
      },
    });

    if (existingParticipant) {
      return res.status(400).json({ error: "User already enrolled in this training" });
    }

    // Create Participant entry
    const participant = await prisma.participant.create({
      data: {
        employeeId,
        trainingId,
        enrollmentDate: new Date(),
        progress: 0,
        status: "Enrolled",
      },
    });
    console.log("participant created 333333333333333333333333333",participant);
    res.status(201).json({ message: "Enrollment successful", participant });
  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ error: "Enrollment failed" });
  }
};
