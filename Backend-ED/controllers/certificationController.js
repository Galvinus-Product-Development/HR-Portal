const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const certificationService = require("../services/certificationService");
// const uploadCertificate = (req, res) => {
//   console.log("Here....................");
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'Please upload a certificate file.' });
//     }

//     const certificateData = {
//       name: req.body.name,
//       issuer: req.body.issuer,
//       issue_date: req.body.issue_date,
//       expiry_date: req.body.expiry_date || null,
//       badge_visibility: req.body.badge_visibility === 'true', // Convert string to boolean
//       certificate_file: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, // File URL
//     };

//     // Here, you would typically save certificateData to a database (MongoDB, PostgreSQL, etc.)
//     console.log('Certificate Uploaded:', certificateData);

//     res.status(201).json({
//       message: 'Certificate uploaded successfully!',
//       certificate: certificateData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error while uploading certificate.' });
//   }
// };

const uploadCertificate = async (req, res) => {
  console.log("Uploading certificate...");

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload a certificate file." });
    }

    const {
      signedUserId,
      name,
      issuer,
      issue_date,
      expiry_date,
      badge_visibility,
    } = req.body;

    if (!signedUserId) {
      return {
        status: 400,
        data: { error: "Invalid or missing signedUserId." },
      };
    }

    // Verify and decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      return { status: 401, data: { error: "Unauthorized: Invalid token" } };
    }

    const employee_id = decoded.userId; // Extract userId from token payload

    if (!employee_id) {
      return {
        status: 401,
        data: { error: "Unauthorized: Invalid user ID in token" },
      };
    }

    // Ensure the employee exists before inserting
    const employee = await prisma.employee.findUnique({
      where: { employee_id },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Prepare data for insertion
    const certificateData = {
      employee_id,
      certificate_name: name,
      issuing_authority: issuer,
      issue_date: new Date(issue_date),
      expiry_date: expiry_date ? new Date(expiry_date) : null,
      certificate_path: `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`, // File URL
      badge_visibility: badge_visibility === "true", // Convert string to boolean
    };

    // Save to the database
    const savedCertificate = await prisma.certification.create({
      data: certificateData,
    });

    res.status(201).json({
      message: "Certificate uploaded successfully!",
      certificate: savedCertificate,
    });
  } catch (error) {
    console.error("Error uploading certificate:", error);
    res
      .status(500)
      .json({ message: "Server error while uploading certificate." });
  }
};

module.exports = { uploadCertificate };

// Get Certifications by Employee ID
const getCertificationsByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId) {
    return {
      status: 400,
      data: { error: "Invalid or missing signedUserId." },
    };
  }

  // Verify and decode JWT token
  let decoded;
  try {
    decoded = jwt.verify(employeeId, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    return { status: 401, data: { error: "Unauthorized: Invalid token" } };
  }

  const employee_id = decoded.userId; // Extract userId from token payload

  if (!employee_id) {
    return {
      status: 401,
      data: { error: "Unauthorized: Invalid user ID in token" },
    };
  }

  try {
    const certifications = await prisma.certification.findMany({
      where: { employee_id }, // Ensure employeeId is an integer
    });

    if (!certifications.length) {
      return res
        .status(404)
        .json({ message: "No certifications found for this employee." });
    }

    res.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCertifications = async (req, res) => {
  try {
    console.log("Entered/////////")
    const certifications = await prisma.certification.findMany({
      include: {
        employee: {
          include: {
            employment: true, // Fetch employment details for each employee
          },
        },
      },
    });
    res.status(200).json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  uploadCertificate,
  getCertificationsByEmployeeId,
  getCertifications,
};
