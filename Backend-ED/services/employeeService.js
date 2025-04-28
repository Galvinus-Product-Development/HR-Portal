const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { response } = require("express");
require("dotenv").config();

exports.createEmployee = async (data) => {
  return await prisma.employee.create({ data });
};

exports.getAllEmployees = async () => {
  return await prisma.employee.findMany();
};

exports.getEmployeeById = async (employeeId) => {
  return await prisma.employee.findUnique({
    where: { employee_id: employeeId },
  });
};

exports.fetchEmployeeByUserId = async (userId) => {
  return await prisma.employee.findUnique({
    where: { employee_id: userId },
  });
};

exports.updateEmployee = async (employeeId, data) => {
  return await prisma.employee.update({
    where: { employee_id: employeeId },
    data,
  });
};

exports.deleteEmployee = async (employeeId) => {
  return await prisma.employee.delete({
    where: { employee_id: employeeId },
  });
};

exports.getFormattedEmployees = async () => {
  try {
    console.log("Entered...........");
    const employees = await prisma.employee.findMany({
      include: {
        employment: true,
      },
    });

    return employees.map((emp) => ({
      id: `${emp.employee_id}`,
      companyEmployeeId: emp.employment?.company_employee_id || "Not Assigned",
      name: `${emp.first_name} ${emp.last_name}`,
      email: emp.email,
      phone: emp.phone_number, // You may also want to include alternate_phone_number if relevant
      alternatePhone: emp.alternate_phone_number, // New field added
      department: emp.employment?.department || "N/A",
      designation: emp.employment?.designation || "N/A",
      location: emp.employment?.work_location || "N/A",
      joinDate: emp.employment?.date_of_joining.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      avatar: emp.profile_pic_url,
      status: emp.employment?.status || "PENDING",
      approvalStatus: emp.approval_status || "PENDING", // Include approval status if needed
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
};

// exports.fetchEmployeeDetailsById = async (employeeId) => {
//   return await prisma.employee
//     .findUnique({
//       where: { employee_id: employeeId },
//       include: {
//         employment: true,
//         bankAccounts: true,
//         emergencyContacts: true,
//         documents: true, // Ensure documents are included
//       },
//     })
//     .then(async (employee) => {
//       if (!employee) return null;

//       // Extract manager_id from employment
//       const managerId = employee.employment?.manager_id;
//       let managerName = null;
//       console.log("111111111111111111122222222", managerId);
//       // Fetch manager name if managerId exists
//       if (managerId) {
//         const manager = await prisma.employee.findUnique({
//           where: { employee_id: managerId },
//           select: { first_name: true, last_name: true },
//         });
//         console.log("1111111111111111111", manager);
//         if (manager) {
//           managerName = `${manager.first_name} ${manager.last_name}`;
//         }
//       }

//       // Extract Aadhar, PAN, PF, and UAN numbers from documents
//       const aadharDoc = employee.documents.find(
//         (doc) => doc.document_type === "AADHAAR"
//       );
//       const panDoc = employee.documents.find(
//         (doc) => doc.document_type === "PAN"
//       );
//       const pfDoc = employee.documents.find(
//         (doc) => doc.document_type === "PF"
//       );
//       const uanDoc = employee.documents.find(
//         (doc) => doc.document_type === "UAN"
//       );
//       const esicDoc = employee.documents.find(
//         (doc) => doc.document_type === "ESIC"
//       );
//       // ${employee.city}, ${employee?.state}, ${employee?.country} - ${employee?.postal_code}
//       return {
//         id: employee.employee_id,
//         personalDetails: {
//           name: `${employee.first_name} ${employee.last_name}`,
//           gender: employee.gender,
//           location: employee.city,
//           dateOfBirth: employee.date_of_birth.toISOString().split("T")[0],
//           phoneNumber: employee.phone_number,
//           alternatePhoneNumber: employee.alternate_phone_number,
//           personalEmail: employee.email,
//           maritalStatus: employee.marital_status,
//           currentAddress: `${employee.current_address}`,
//           permanentAddress: employee.permanent_address,
//           nationality: employee.nationality,
//           bloodGroup: employee.blood_group,
//           approvalStatus: employee.approval_status || "PENDING",
//           aadharNumber: aadharDoc ? aadharDoc.document_number : null,
//           panNumber: panDoc ? panDoc.document_number : null,
//         },
//         employmentDetails: {
//           id: employee.employment?.employee_id,
//           employeeId: employee.employee_id,
//           jobTitle: employee.employment?.designation,
//           department: employee.employment?.department,
//           officeEmail: employee.employment?.official_email,
//           dateOfJoining: employee.employment?.date_of_joining
//             .toISOString()
//             .split("T")[0],
//           employmentType: employee.employment?.employment_type,
//           location: employee.employment?.work_location,
//           status: employee.employment?.status || "ACTIVE",
//           // pfNumber:
//           //   employee.employment?.pf_number ||
//           //   (pfDoc ? pfDoc.document_number : null),
//           // uanNumber:
//           //   employee.employment?.uan_number ||
//           //   (uanDoc ? uanDoc.document_number : null),
//           lineManager: managerName,
//           lineManagerId: employee.employment?.manager_id,
//           pfNumber: pfDoc ? pfDoc.document_number : null,
//           uanNumber: uanDoc ? uanDoc.document_number : null,
//           esicNumber: esicDoc ? esicDoc.document_number : null,
//         },
//         bankDetails:
//           employee.bankAccounts.length > 0
//             ? {
//                 bankName: employee.bankAccounts[0].bank_name,
//                 // accountNumber: `****${employee.bankAccounts[0].account_number.slice(
//                 //   -4
//                 // )}`,
//                 accountNumber: `${employee.bankAccounts[0].account_number}`,
//                 ifscCode: employee.bankAccounts[0].ifsc_code,
//                 accountType: employee.bankAccounts[0].account_type,
//                 accountHolder: employee.bankAccounts[0].account_holder_name,
//               }
//             : null,
//         emergencyContact:
//           employee.emergencyContacts.length > 0
//             ? {
//                 id: employee.emergencyContacts[0].contact_id,
//                 name: employee.emergencyContacts[0].contact_name,
//                 phoneNumber: employee.emergencyContacts[0].contact_phone,
//                 relationship: employee.emergencyContacts[0].relationship,
//               }
//             : null,
//         avatar: employee.profile_pic_url,
//         // approvalStatus: employee.approval_status || "PENDING",
//         documents: employee.documents.map((doc) => ({
//           id: doc.document_id,
//           documentType: doc.document_type,
//           documentNumber: doc.document_number,
//           documentPath: doc.document_path,
//           approvalStatus: doc.approval_status || "PENDING",
//         })),
//         // Added Aadhar, PAN, PF, UAN, ESIC numbers
//         // aadharNumber: aadharDoc ? aadharDoc.document_number : null,
//         // panNumber: panDoc ? panDoc.document_number : null,
//         // pfNumber: pfDoc ? pfDoc.document_number : null,
//         // uanNumber: uanDoc ? uanDoc.document_number : null,
//         // esicNumber: esicDoc ? esicDoc.document_number : null,
//       };
//     })
//     .catch((error) => {
//       console.error("Database error:", error);
//       return null;
//     });
// };

exports.fetchEmployeeDetailsById = async (employeeId) => {
  return await prisma.employee
    .findUnique({
      where: { employee_id: employeeId },
      include: {
        employment: true,
        bankAccounts: true,
        emergencyContacts: true,
        documents: true,
      },
    })
    .then(async (employee) => {
      if (!employee) return null;

      const managerId = employee.employment?.manager_id;
      let managerName = null;

      if (managerId) {
        const manager = await prisma.employee.findUnique({
          where: { employee_id: managerId },
          select: { first_name: true, last_name: true },
        });

        if (manager) {
          managerName = `${manager.first_name} ${manager.last_name}`;
        }
      }

      // Extract documents
      const aadharDoc = employee.documents.find(
        (doc) => doc.document_type === "AADHAAR"
      );
      const panDoc = employee.documents.find(
        (doc) => doc.document_type === "PAN"
      );
      const pfDoc = employee.documents.find(
        (doc) => doc.document_type === "PF"
      );
      const uanDoc = employee.documents.find(
        (doc) => doc.document_type === "UAN"
      );
      const esicDoc = employee.documents.find(
        (doc) => doc.document_type === "ESIC"
      );

      console.log(employee);

      return {
        id: employee.employee_id,
        personalDetails: {
          name: `${employee.first_name} ${employee.last_name}`,
          gender: employee.gender,
          location: employee.current_city, // Optional field for UI display
          dateOfBirth: employee.date_of_birth?.toISOString().split("T")[0],
          phoneNumber: employee.phone_number,
          alternatePhoneNumber: employee.alternate_phone_number,
          personalEmail: employee.email,
          maritalStatus: employee.marital_status,
          nationality: employee.nationality,
          bloodGroup: employee.blood_group,
          approvalStatus: employee.approval_status || "PENDING",
          aadharNumber: aadharDoc?.document_number || null,
          panNumber: panDoc?.document_number || null,

          currentAddress: {
            street: employee.current_street_details,
            city: employee.current_city,
            state: employee.current_state,
            country: employee.current_country,
            zipCode: employee.current_zip,
          },

          permanentAddress: {
            street: employee.permanent_street_details,
            city: employee.permanent_city,
            state: employee.permanent_state,
            country: employee.permanent_country,
            zipCode: employee.permanent_zip,
          },
        },

        employmentDetails: {
          id: employee.employment?.employee_id,
          companyEmployeeId:
            employee.employment?.company_employee_id || "Not Assigned",
          employeeId: employee.employee_id,
          jobTitle: employee.employment?.designation,
          department: employee.employment?.department,
          officeEmail: employee.employment?.official_email,
          dateOfJoining: employee.employment?.date_of_joining
            ?.toISOString()
            .split("T")[0],
          employmentType: employee.employment?.employment_type,
          location: employee.employment?.work_location,
          status: employee.employment?.status || "ACTIVE",
          lineManager: managerName,
          lineManagerId: employee.employment?.manager_id,
          pfNumber: pfDoc?.document_number || null,
          uanNumber: uanDoc?.document_number || null,
          esicNumber: esicDoc?.document_number || null,
        },

        bankDetails:
          employee.bankAccounts.length > 0
            ? {
                bankName: employee.bankAccounts[0].bank_name,
                accountNumber: employee.bankAccounts[0].account_number,
                ifscCode: employee.bankAccounts[0].ifsc_code,
                accountType: employee.bankAccounts[0].account_type,
                accountHolder: employee.bankAccounts[0].account_holder_name,
              }
            : null,

        emergencyContact:
          employee.emergencyContacts.length > 0
            ? {
                id: employee.emergencyContacts[0].contact_id,
                name: employee.emergencyContacts[0].contact_name,
                phoneNumber: employee.emergencyContacts[0].contact_phone,
                relationship: employee.emergencyContacts[0].relationship,
              }
            : null,

        avatar: employee.profile_pic_url,

        documents: employee.documents.map((doc) => ({
          id: doc.document_id,
          documentType: doc.document_type,
          documentNumber: doc.document_number,
          documentPath: doc.document_path,
          approvalStatus: doc.approval_status || "PENDING",
        })),
      };
    })
    .catch((error) => {
      console.error("Database error:", error);
      return null;
    });
};

// exports.createPersonalDetails = async (data) => {
//   console.log("this is personal details api........",data);
//   console.log("Here it is end");
//   try {
//     const {
//       signedUserId,
//       name,
//       gender,
//       location,
//       dateOfBirth,
//       bloodGroup,
//       email,
//       phone,
//       alternatePhone,
//       emergencyContact,
//       emergencyContactName,
//       emergencyContactRelationship,
//       emergencyContactEmail,
//       currentAddress,
//       permanentAddress,
//       maritalStatus,
//       aadhaar,
//       pan,
//       aadhaarIssueDate,
//       aadhaarExpiryDate,
//       panIssueDate,
//       panExpiryDate,
//       aadhaarPath,
//       panPath,
//     } = data;
//     // Validate signedUserId
//     if (!signedUserId) {
//       console.log("Here>>>")
//       return {
//         status: 400,
//         data: { error: "Invalid or missing signedUserId." },
//       };
//     }

//     // Verify and decode JWT token
//     let decoded;
//     try {
//       decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
//     } catch (error) {
//       console.log(error);
//       return { status: 401, data: { error: "Unauthorized: Invalid token" } };
//     }

//     const userId = decoded.userId; // Extract userId from token payload

//     if (!userId) {
//       return {
//         status: 401,
//         data: { error: "Unauthorized: Invalid user ID in token" },
//       };
//     }

//     // Check if an employee already exists for this userId
//     const existingEmployee = await prisma.employee.findUnique({
//       where: { employee_id: userId },
//     });

//     if (existingEmployee) {
//       return {
//         status: 400,
//         data: { error: "Employee already exists for this user" },
//       };
//     }

//     // Validate required fields
//     if (!name || !email || !phone || !dateOfBirth) {
//       return { status: 400, data: { error: "Required fields are missing." } };
//     }

//     // Split name into first and last name
//     const [firstName, ...lastNameParts] = name.split(" ");
//     const lastName = lastNameParts.join(" ") || "";

//     // Create employee record
//     const newEmployee = await prisma.employee.create({
//       data: {
//         employee_id: userId,
//         first_name: firstName,
//         last_name: lastName,
//         gender: gender?.toUpperCase() || "UNKNOWN",
//         city: "Silchar",
//         state: "Assam",
//         country: "India",
//         postal_code: "788111",
//         date_of_birth: new Date(dateOfBirth),
//         blood_group: bloodGroup,
//         email,
//         phone_number: phone,
//         alternate_phone_number: alternatePhone,
//         current_address: currentAddress,
//         permanent_address: permanentAddress,
//         marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
//         nationality: "Indian",
//         approval_status: "PENDING",
//         profile_pic_url: "",

//         emergencyContacts: {
//           create: emergencyContact
//             ? [
//                 {
//                   contact_phone: emergencyContact,
//                   contact_name: emergencyContactName || "UNKNOWN",
//                   relationship: emergencyContactRelationship || "UNKNOWN",
//                   contact_email: emergencyContactEmail || "",
//                   approval_status: "PENDING", // Ensure uppercase
//                 },
//               ]
//             : [],
//         },

//         documents: {
//           create: [
//             ...(aadhaar
//               ? [
//                   {
//                     document_type: "AADHAAR",
//                     document_number: aadhaar,
//                     approval_status: "PENDING",
//                     issue_date: aadhaarIssueDate
//                       ? new Date(aadhaarIssueDate)
//                       : new Date(),
//                     expiry_date: aadhaarExpiryDate
//                       ? new Date(aadhaarExpiryDate)
//                       : null,
//                     document_path: aadhaarPath || "",
//                   },
//                 ]
//               : []),
//             ...(pan
//               ? [
//                   {
//                     document_type: "PAN",
//                     document_number: pan,
//                     approval_status: "PENDING",
//                     issue_date: panIssueDate
//                       ? new Date(panIssueDate)
//                       : new Date(),
//                     expiry_date: panExpiryDate ? new Date(panExpiryDate) : null,
//                     document_path: panPath || "",
//                   },
//                 ]
//               : []),
//           ].map((doc) => ({
//             ...doc,
//             document_type: doc.document_type.toUpperCase(),
//             approval_status: doc.approval_status.toUpperCase(),
//           })),
//         },
//       },
//       include: {
//         emergencyContacts: true,
//         documents: true,
//       },
//     });

//     return {
//       status: 201,
//       data: {
//         message: "Employee details submitted successfully",
//         employee: newEmployee,
//       },
//     };
//   } catch (error) {
//     console.error("Service Error:", error);
//     return { status: 500, data: { error: "Internal Server Error" } };
//   }
// };

// exports.createPersonalDetails = async (data) => {
//   console.log("this is personal details api........", data);
//   try {
//     const {
//       signedUserId,
//       name,
//       gender,
//       location,
//       dateOfBirth,
//       bloodGroup,
//       email,
//       phone,
//       alternatePhone,
//       emergencyContact,
//       emergencyContactName,
//       emergencyContactRelationship,
//       emergencyContactEmail,
//       currentAddress,
//       permanentAddress,
//       maritalStatus,
//       aadhaar,
//       pan,
//       aadhaarIssueDate,
//       aadhaarExpiryDate,
//       panIssueDate,
//       panExpiryDate,
//       aadhaarPath,
//       panPath,
//     } = data;

//     if (!signedUserId) {
//       return {
//         status: 400,
//         data: { error: "Invalid or missing signedUserId." },
//       };
//     }

//     // Decode JWT token
//     let decoded;
//     try {
//       decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
//     } catch (error) {
//       console.log(error);
//       return { status: 401, data: { error: "Unauthorized: Invalid token" } };
//     }

//     const userId = decoded.userId;

//     if (!userId) {
//       return {
//         status: 401,
//         data: { error: "Unauthorized: Invalid user ID in token" },
//       };
//     }

//     if (!name || !email || !phone || !dateOfBirth) {
//       return { status: 400, data: { error: "Required fields are missing." } };
//     }

//     const [firstName, ...lastNameParts] = name.split(" ");
//     const lastName = lastNameParts.join(" ") || "";

//     // Delete existing submission (and related entries via cascade or manual delete)
//     const existing = await prisma.personalDetailsSubmission.findFirst({
//       where: { user_id: userId },
//       select: { id: true },
//     });

//     if (existing) {
//       await prisma.emergencySubmission.deleteMany({
//         where: { personal_details_submission_id: existing.id },
//       });
//       await prisma.documentSubmission.deleteMany({
//         where: { personal_details_submission_id: existing.id },
//       });
//       await prisma.personalDetailsSubmission.delete({
//         where: { id: existing.id },
//       });
//     }

//     // Create new submission
//     const personalSubmission = await prisma.personalDetailsSubmission.create({
//       data: {
//         user_id: userId,
//         first_name: firstName,
//         last_name: lastName,
//         gender: gender?.toUpperCase() || "UNKNOWN",
//         date_of_birth: new Date(dateOfBirth),
//         blood_group: bloodGroup,
//         email,
//         phone_number: phone,
//         alternate_phone_number: alternatePhone,
//         current_address: currentAddress,
//         permanent_address: permanentAddress,
//         city: location?.city || "Silchar",
//         state: location?.state || "Assam",
//         country: location?.country || "India",
//         postal_code: location?.postalCode || "788111",
//         nationality: "Indian",
//         marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
//         profile_pic_url: "",

//         emergencyContacts: emergencyContact
//           ? {
//               create: [
//                 {
//                   contact_name: emergencyContactName || "UNKNOWN",
//                   relationship: emergencyContactRelationship || "UNKNOWN",
//                   contact_phone: emergencyContact,
//                   contact_email: emergencyContactEmail || "",
//                   approval_status: "PENDING",
//                 },
//               ],
//             }
//           : undefined,

//         documents: {
//           create: [
//             ...(aadhaar
//               ? [
//                   {
//                     document_type: "AADHAAR",
//                     document_number: aadhaar,
//                     approval_status: "PENDING",
//                     issue_date: aadhaarIssueDate
//                       ? new Date(aadhaarIssueDate)
//                       : new Date(),
//                     expiry_date: aadhaarExpiryDate
//                       ? new Date(aadhaarExpiryDate)
//                       : null,
//                     document_path: aadhaarPath || "",
//                   },
//                 ]
//               : []),
//             ...(pan
//               ? [
//                   {
//                     document_type: "PAN",
//                     document_number: pan,
//                     approval_status: "PENDING",
//                     issue_date: panIssueDate
//                       ? new Date(panIssueDate)
//                       : new Date(),
//                     expiry_date: panExpiryDate ? new Date(panExpiryDate) : null,
//                     document_path: panPath || "",
//                   },
//                 ]
//               : []),
//           ],
//         },
//       },
//       include: {
//         emergencyContacts: true,
//         documents: true,
//       },
//     });

//     return {
//       status: 201,
//       data: {
//         message: "Latest personal details submitted successfully.",
//         submission: personalSubmission,
//       },
//     };
//   } catch (error) {
//     console.error("Service Error:", error);
//     return { status: 500, data: { error: "Internal Server Error" } };
//   }
// };

const sendNotification = async ({
  userId,
  sourceId = null,
  sourceType = "USER",
  type = "AUTO",
  title,
  message,
  priority = "NORMAL",
  redirectUrl = null,
}) => {
  try {
    const NOTIFICATION_URL = process.env.NOTIFICATION_SERVICE_URL;

    if (!NOTIFICATION_URL) {
      console.warn("Notification URL is not set in environment variables.");
      return;
    }

    await axios.post(NOTIFICATION_URL, {
      userId,
      sourceId,
      sourceType,
      type,
      title,
      message,
      priority,
      redirectUrl,
    });
  } catch (error) {
    console.error("Notification error:", error.response?.data || error.message);
  }
};

// exports.createPersonalDetails = async (data) => {
//   console.log("this is personal details api........", data);
//   try {
//     const {
//       signedUserId,
//       name,
//       gender,
//       location,
//       dateOfBirth,
//       bloodGroup,
//       email,
//       phone,
//       alternatePhone,
//       emergencyContact,
//       emergencyContactName,
//       emergencyContactRelationship,
//       emergencyContactEmail,
//       currentAddress,
//       permanentAddress,
//       maritalStatus,
//       aadhaar,
//       pan,
//       aadhaarIssueDate,
//       aadhaarExpiryDate,
//       panIssueDate,
//       panExpiryDate,
//       aadhaarPath,
//       panPath,
//     } = data;

//     if (!signedUserId) {
//       return {
//         status: 400,
//         data: { error: "Invalid or missing signedUserId." },
//       };
//     }

//     // Decode JWT token
//     let decoded;
//     try {
//       decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
//     } catch (error) {
//       console.log(error);
//       return { status: 401, data: { error: "Unauthorized: Invalid token" } };
//     }

//     const userId = decoded.userId;
//     if (!userId) {
//       return {
//         status: 401,
//         data: { error: "Unauthorized: Invalid user ID in token" },
//       };
//     }

//     if (!name || !email || !phone || !dateOfBirth) {
//       return { status: 400, data: { error: "Required fields are missing." } };
//     }

//     const [firstName, ...lastNameParts] = name.split(" ");
//     const lastName = lastNameParts.join(" ") || "";

//     // Check if employee already exists
//     const existingEmployee = await prisma.employee.findUnique({
//       where: { employee_id: userId },
//     });

//     // If employee does NOT exist, directly create in Employee table
//     if (!existingEmployee) {
//       const newEmployee = await prisma.employee.create({
//         data: {
//           employee_id: userId,
//           first_name: firstName,
//           last_name: lastName,
//           gender: gender?.toUpperCase() || "UNKNOWN",
//           date_of_birth: new Date(dateOfBirth),
//           blood_group: bloodGroup,
//           email,
//           phone_number: phone,
//           alternate_phone_number: alternatePhone,
//           current_address: currentAddress,
//           permanent_address: permanentAddress,
//           city: location?.city || "Silchar",
//           state: location?.state || "Assam",
//           country: location?.country || "India",
//           postal_code: location?.postalCode || "788111",
//           nationality: "Indian",
//           marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
//           profile_pic_url: "",
//           approval_status: "APPROVED",

//           emergencyContacts: emergencyContact
//             ? {
//                 create: [
//                   {
//                     contact_name: emergencyContactName || "UNKNOWN",
//                     relationship: emergencyContactRelationship || "UNKNOWN",
//                     contact_phone: emergencyContact,
//                     contact_email: emergencyContactEmail || "",
//                     approval_status: "APPROVED",
//                   },
//                 ],
//               }
//             : undefined,

//           documents: {
//             create: [
//               ...(aadhaar
//                 ? [
//                     {
//                       document_type: "AADHAAR",
//                       document_number: aadhaar,
//                       approval_status: "APPROVED",
//                       issue_date: aadhaarIssueDate
//                         ? new Date(aadhaarIssueDate)
//                         : new Date(),
//                       expiry_date: aadhaarExpiryDate
//                         ? new Date(aadhaarExpiryDate)
//                         : null,
//                       document_path: aadhaarPath || "",
//                     },
//                   ]
//                 : []),
//               ...(pan
//                 ? [
//                     {
//                       document_type: "PAN",
//                       document_number: pan,
//                       approval_status: "APPROVED",
//                       issue_date: panIssueDate
//                         ? new Date(panIssueDate)
//                         : new Date(),
//                       expiry_date: panExpiryDate
//                         ? new Date(panExpiryDate)
//                         : null,
//                       document_path: panPath || "",
//                     },
//                   ]
//                 : []),
//             ],
//           },
//         },
//         include: {
//           emergencyContacts: true,
//           documents: true,
//         },
//       });

//       return {
//         status: 201,
//         data: {
//           message: "Personal details directly saved to Employee table (first time entry).",
//           employee: newEmployee,
//         },
//       };
//     }

//     // If employee exists → proceed with personalDetailsSubmission
//     const existingSubmission = await prisma.personalDetailsSubmission.findFirst({
//       where: { user_id: userId },
//       select: { id: true },
//     });

//     if (existingSubmission) {
//       await prisma.emergencySubmission.deleteMany({
//         where: { personal_details_id: existingSubmission.id },
//       });
//       await prisma.documentSubmission.deleteMany({
//         where: { personal_details_id: existingSubmission.id },
//       });
//       await prisma.personalDetailsSubmission.delete({
//         where: { id: existingSubmission.id },
//       });
//     }

//     const personalSubmission = await prisma.personalDetailsSubmission.create({
//       data: {
//         user_id: userId,
//         first_name: firstName,
//         last_name: lastName,
//         gender: gender?.toUpperCase() || "UNKNOWN",
//         date_of_birth: new Date(dateOfBirth),
//         blood_group: bloodGroup,
//         email,
//         phone_number: phone,
//         alternate_phone_number: alternatePhone,
//         current_address: currentAddress,
//         permanent_address: permanentAddress,
//         city: location?.city || "Silchar",
//         state: location?.state || "Assam",
//         country: location?.country || "India",
//         postal_code: location?.postalCode || "788111",
//         nationality: "Indian",
//         marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
//         profile_pic_url: "",

//         emergencyContacts: emergencyContact
//           ? {
//               create: [
//                 {
//                   contact_name: emergencyContactName || "UNKNOWN",
//                   relationship: emergencyContactRelationship || "UNKNOWN",
//                   contact_phone: emergencyContact,
//                   contact_email: emergencyContactEmail || "",
//                   approval_status: "PENDING",
//                 },
//               ],
//             }
//           : undefined,

//         documents: {
//           create: [
//             ...(aadhaar
//               ? [
//                   {
//                     document_type: "AADHAAR",
//                     document_number: aadhaar,
//                     approval_status: "PENDING",
//                     issue_date: aadhaarIssueDate
//                       ? new Date(aadhaarIssueDate)
//                       : new Date(),
//                     expiry_date: aadhaarExpiryDate
//                       ? new Date(aadhaarExpiryDate)
//                       : null,
//                     document_path: aadhaarPath || "",
//                   },
//                 ]
//               : []),
//             ...(pan
//               ? [
//                   {
//                     document_type: "PAN",
//                     document_number: pan,
//                     approval_status: "PENDING",
//                     issue_date: panIssueDate
//                       ? new Date(panIssueDate)
//                       : new Date(),
//                     expiry_date: panExpiryDate ? new Date(panExpiryDate) : null,
//                     document_path: panPath || "",
//                   },
//                 ]
//               : []),
//           ],
//         },
//       },
//       include: {
//         emergencyContacts: true,
//         documents: true,
//       },
//     });

//     return {
//       status: 201,
//       data: {
//         message: "Personal details submitted for review.",
//         submission: personalSubmission,
//       },
//     };
//   } catch (error) {
//     console.error("Service Error:", error);
//     return { status: 500, data: { error: "Internal Server Error" } };
//   }
// };

// exports.createPersonalDetails = async (data) => {
//   console.log("this is personal details api........", data);
//   try {
//     const {
//       signedUserId,
//       name,
//       gender,
//       location,
//       dateOfBirth,
//       bloodGroup,
//       email,
//       phone,
//       alternatePhone,
//       emergencyContact,
//       emergencyContactName,
//       emergencyContactRelationship,
//       emergencyContactEmail,
//       currentAddress,
//       permanentAddress,
//       maritalStatus,
//       aadhaar,
//       pan,
//       aadhaarIssueDate,
//       aadhaarExpiryDate,
//       panIssueDate,
//       panExpiryDate,
//       aadhaarPath,
//       panPath,
//     } = data;

//     if (!signedUserId) {
//       return {
//         status: 400,
//         data: { error: "Invalid or missing signedUserId." },
//       };
//     }

//     // Decode JWT token
//     let decoded;
//     try {
//       decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
//     } catch (error) {
//       console.log(error);
//       return { status: 401, data: { error: "Unauthorized: Invalid token" } };
//     }

//     const userId = decoded.userId;
//     if (!userId) {
//       return {
//         status: 401,
//         data: { error: "Unauthorized: Invalid user ID in token" },
//       };
//     }

//     if (!name || !email || !phone || !dateOfBirth) {
//       return { status: 400, data: { error: "Required fields are missing." } };
//     }

//     const [firstName, ...lastNameParts] = name.split(" ");
//     const lastName = lastNameParts.join(" ") || "";

//     // Check if employee already exists
//     const existingEmployee = await prisma.employee.findUnique({
//       where: { employee_id: userId },
//     });

//     let newEmployee;
//     if (!existingEmployee) {
//       // Create a new employee record
//       newEmployee = await prisma.employee.create({
//         data: {
//           employee_id: userId,
//           first_name: firstName,
//           last_name: lastName,
//           gender: gender?.toUpperCase() || "UNKNOWN",
//           date_of_birth: new Date(dateOfBirth),
//           blood_group: bloodGroup,
//           email,
//           phone_number: phone,
//           alternate_phone_number: alternatePhone,
//           current_address: currentAddress,
//           permanent_address: permanentAddress,
//           city: location?.city || "Silchar",
//           state: location?.state || "Assam",
//           country: location?.country || "India",
//           postal_code: location?.postalCode || "788111",
//           nationality: "Indian",
//           marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
//           profile_pic_url: "",
//           approval_status: "APPROVED",
//           emergencyContacts: emergencyContact
//             ? {
//                 create: [
//                   {
//                     contact_name: emergencyContactName || "UNKNOWN",
//                     relationship: emergencyContactRelationship || "UNKNOWN",
//                     contact_phone: emergencyContact,
//                     contact_email: emergencyContactEmail || "",
//                     approval_status: "APPROVED",
//                   },
//                 ],
//               }
//             : undefined,
//           documents: {
//             create: [
//               ...(aadhaar
//                 ? [
//                     {
//                       document_type: "AADHAAR",
//                       document_number: aadhaar,
//                       approval_status: "APPROVED",
//                       issue_date: aadhaarIssueDate
//                         ? new Date(aadhaarIssueDate)
//                         : new Date(),
//                       expiry_date: aadhaarExpiryDate
//                         ? new Date(aadhaarExpiryDate)
//                         : null,
//                       document_path: aadhaarPath || "",
//                     },
//                   ]
//                 : []),
//               ...(pan
//                 ? [
//                     {
//                       document_type: "PAN",
//                       document_number: pan,
//                       approval_status: "APPROVED",
//                       issue_date: panIssueDate
//                         ? new Date(panIssueDate)
//                         : new Date(),
//                       expiry_date: panExpiryDate
//                         ? new Date(panExpiryDate)
//                         : null,
//                       document_path: panPath || "",
//                     },
//                   ]
//                 : []),
//             ],
//           },
//         },
//         include: {
//           emergencyContacts: true,
//           documents: true,
//         },
//       });

//       // Notify all employees about the new personal details
//       const employees = await prisma.employee.findMany(); // Get all employees

//       // Send a notification to all employees

//       console.log("This is the URL11111111111:---",`${process.env.APP_URL}/employees/${userId}`);

//       for (let employee of employees) {
//         await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
//           userIds: [employee.employee_id],
//           title: "New Personal Details Submission",
//           message: `Employee ${firstName} ${lastName} has submitted their personal details.`,
//           priority: "NORMAL",
//           redirectUrl: `${process.env.APP_URL}/employees/${userId}`, // URL to view the employee's details
//           recipientType: "ADMIN",
//         });
//       }

//       return {
//         status: 201,
//         data: {
//           message: "Personal details directly saved to Employee table (first time entry).",
//           employee: newEmployee,
//         },
//       };
//     }

//     // If employee exists → proceed with personalDetailsSubmission
//     const existingSubmission = await prisma.personalDetailsSubmission.findFirst({
//       where: { user_id: userId },
//       select: { id: true },
//     });

//     if (existingSubmission) {
//       await prisma.emergencySubmission.deleteMany({
//         where: { personal_details_id: existingSubmission.id },
//       });
//       await prisma.documentSubmission.deleteMany({
//         where: { personal_details_id: existingSubmission.id },
//       });
//       await prisma.personalDetailsSubmission.delete({
//         where: { id: existingSubmission.id },
//       });
//     }

//     const personalSubmission = await prisma.personalDetailsSubmission.create({
//       data: {
//         user_id: userId,
//         first_name: firstName,
//         last_name: lastName,
//         gender: gender?.toUpperCase() || "UNKNOWN",
//         date_of_birth: new Date(dateOfBirth),
//         blood_group: bloodGroup,
//         email,
//         phone_number: phone,
//         alternate_phone_number: alternatePhone,
//         current_address: currentAddress,
//         permanent_address: permanentAddress,
//         city: location?.city || "Silchar",
//         state: location?.state || "Assam",
//         country: location?.country || "India",
//         postal_code: location?.postalCode || "788111",
//         nationality: "Indian",
//         marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
//         profile_pic_url: "",
//         emergencyContacts: emergencyContact
//           ? {
//               create: [
//                 {
//                   contact_name: emergencyContactName || "UNKNOWN",
//                   relationship: emergencyContactRelationship || "UNKNOWN",
//                   contact_phone: emergencyContact,
//                   contact_email: emergencyContactEmail || "",
//                   approval_status: "PENDING",
//                 },
//               ],
//             }
//           : undefined,
//         documents: {
//           create: [
//             ...(aadhaar
//               ? [
//                   {
//                     document_type: "AADHAAR",
//                     document_number: aadhaar,
//                     approval_status: "PENDING",
//                     issue_date: aadhaarIssueDate
//                       ? new Date(aadhaarIssueDate)
//                       : new Date(),
//                     expiry_date: aadhaarExpiryDate
//                       ? new Date(aadhaarExpiryDate)
//                       : null,
//                     document_path: aadhaarPath || "",
//                   },
//                 ]
//               : []),
//             ...(pan
//               ? [
//                   {
//                     document_type: "PAN",
//                     document_number: pan,
//                     approval_status: "PENDING",
//                     issue_date: panIssueDate
//                       ? new Date(panIssueDate)
//                       : new Date(),
//                     expiry_date: panExpiryDate ? new Date(panExpiryDate) : null,
//                     document_path: panPath || "",
//                   },
//                 ]
//               : []),
//           ],
//         },
//       },
//       include: {
//         emergencyContacts: true,
//         documents: true,
//       },
//     });

//     // Notify all employees about the personal details submission
//     const employees = await prisma.employee.findMany(); // Get all employees

//     console.log("This is the URL:---",`${process.env.APP_URL}/employees/${userId}`);

//     for (let employee of employees) {
//       await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
//         userIds: [employee.employee_id],
//         title: "New Personal Details Submission",
//         message: `Employee ${firstName} ${lastName} has submitted their personal details for review.`,
//         priority: "NORMAL",
//         redirectUrl: `${process.env.APP_URL}/employees/${userId}`, // URL to view the employee's details
//         recipientType: "ADMIN", // Notification for employees
//       });
//     }

//     return {
//       status: 201,
//       data: {
//         message: "Personal details submitted for review.",
//         submission: personalSubmission,
//       },
//     };
//   } catch (error) {
//     console.error("Service Error:", error);
//     return { status: 500, data: { error: "Internal Server Error" } };
//   }
// };

exports.createPersonalDetails = async (data) => {
  console.log("this is personal details api........", data);
  try {
    const {
      signedUserId,
      name,
      gender,
      dateOfBirth,
      bloodGroup,
      email,
      phone,
      alternatePhone,
      emergencyContact,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactEmail,
      // NEW address fields
      currentStreet,
      currentCity,
      currentState,
      currentCountry,
      currentZip,
      permanentStreet,
      permanentCity,
      permanentState,
      permanentCountry,
      permanentZip,
      maritalStatus,
      aadhaar,
      pan,
      aadhaarIssueDate,
      aadhaarExpiryDate,
      panIssueDate,
      panExpiryDate,
      aadhaarPath,
      panPath,
    } = data;

    if (!signedUserId) {
      return {
        status: 400,
        data: { error: "Invalid or missing signedUserId." },
      };
    }

    // Decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(signedUserId, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      return { status: 401, data: { error: "Unauthorized: Invalid token" } };
    }

    const userId = decoded.userId;
    if (!userId) {
      return {
        status: 401,
        data: { error: "Unauthorized: Invalid user ID in token" },
      };
    }

    if (!name || !email || !phone || !dateOfBirth) {
      return { status: 400, data: { error: "Required fields are missing." } };
    }

    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "";

    const existingEmployee = await prisma.employee.findUnique({
      where: { employee_id: userId },
      include:{employment:true}
    });

    let newEmployee;
    if (!existingEmployee) {
      newEmployee = await prisma.employee.create({
        data: {
          employee_id: userId,
          first_name: firstName,
          last_name: lastName,
          gender: gender?.toUpperCase() || "UNKNOWN",
          date_of_birth: new Date(dateOfBirth),
          blood_group: bloodGroup,
          email,
          phone_number: phone,
          alternate_phone_number: alternatePhone,
          // Updated address fields
          current_street_details: currentStreet,
          current_city: currentCity,
          current_state: currentState,
          current_country: currentCountry,
          current_zip: currentZip,
          permanent_street_details: permanentStreet,
          permanent_city: permanentCity,
          permanent_state: permanentState,
          permanent_country: permanentCountry,
          permanent_zip: permanentZip,
          nationality: "Indian",
          marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
          profile_pic_url: "",
          approval_status: "APPROVED",
          emergencyContacts: emergencyContact
            ? {
                create: [
                  {
                    contact_name: emergencyContactName || "UNKNOWN",
                    relationship: emergencyContactRelationship || "UNKNOWN",
                    contact_phone: emergencyContact,
                    contact_email: emergencyContactEmail || "",
                    approval_status: "APPROVED",
                  },
                ],
              }
            : undefined,
          documents: {
            create: [
              ...(aadhaar
                ? [
                    {
                      document_type: "AADHAAR",
                      document_number: aadhaar,
                      approval_status: "APPROVED",
                      issue_date: aadhaarIssueDate
                        ? new Date(aadhaarIssueDate)
                        : new Date(),
                      expiry_date: aadhaarExpiryDate
                        ? new Date(aadhaarExpiryDate)
                        : null,
                      document_path: aadhaarPath || "",
                    },
                  ]
                : []),
              ...(pan
                ? [
                    {
                      document_type: "PAN",
                      document_number: pan,
                      approval_status: "APPROVED",
                      issue_date: panIssueDate
                        ? new Date(panIssueDate)
                        : new Date(),
                      expiry_date: panExpiryDate
                        ? new Date(panExpiryDate)
                        : null,
                      document_path: panPath || "",
                    },
                  ]
                : []),
            ],
          },
        },
        include: {
          emergencyContacts: true,
          documents: true,
        },
      });


      // const employees = await prisma.employee.findMany();
      // for (let employee of employees) {
        // await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
        //   userIds: [employee.manager_id],
        //   title: "New Personal Details Submission",
        //   message: `Employee ${firstName} ${lastName} has submitted their personal details.`,
        //   priority: "NORMAL",
        //   redirectUrl: `${process.env.APP_URL}/employees/${userId}`,
        //   recipientType: "ADMIN",
        // });
      // }

      // const existingEmployee = await prisma.employee.findUnique({
      //   where: { employee_id: userId },
      // });
      await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
        userIds: [existingEmployee?.employment?.manager_id],
        title: "New Personal Details Submission",
        message: `Employee ${firstName} ${lastName} has submitted their personal details.`,
        priority: "NORMAL",
        redirectUrl: `${process.env.APP_URL}/employees/${userId}`,
        recipientType: "ADMIN",
      });
      return {
        status: 201,
        data: {
          message:
            "Personal details directly saved to Employee table (first time entry).",
          employee: newEmployee,
        },
      };
    }

    // Submission logic if employee exists
    const existingSubmission = await prisma.personalDetailsSubmission.findFirst(
      {
        where: { user_id: userId },
        select: { id: true },
      }
    );

    if (existingSubmission) {
      await prisma.emergencySubmission.deleteMany({
        where: { personal_details_id: existingSubmission.id },
      });
      await prisma.documentSubmission.deleteMany({
        where: { personal_details_id: existingSubmission.id },
      });
      await prisma.personalDetailsSubmission.delete({
        where: { id: existingSubmission.id },
      });
    }

    const personalSubmission = await prisma.personalDetailsSubmission.create({
      data: {
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        gender: gender?.toUpperCase() || "UNKNOWN",
        date_of_birth: new Date(dateOfBirth),
        blood_group: bloodGroup,
        email,
        phone_number: phone,
        alternate_phone_number: alternatePhone,
        // Updated address fields
        current_street_details: currentStreet,
        current_city: currentCity,
        current_state: currentState,
        current_country: currentCountry,
        current_zip: currentZip,
        permanent_street_details: permanentStreet,
        permanent_city: permanentCity,
        permanent_state: permanentState,
        permanent_country: permanentCountry,
        permanent_zip: permanentZip,
        nationality: "Indian",
        marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
        profile_pic_url: "",
        emergencyContacts: emergencyContact
          ? {
              create: [
                {
                  contact_name: emergencyContactName || "UNKNOWN",
                  relationship: emergencyContactRelationship || "UNKNOWN",
                  contact_phone: emergencyContact,
                  contact_email: emergencyContactEmail || "",
                  approval_status: "PENDING",
                },
              ],
            }
          : undefined,
        documents: {
          create: [
            ...(aadhaar
              ? [
                  {
                    document_type: "AADHAAR",
                    document_number: aadhaar,
                    approval_status: "PENDING",
                    issue_date: aadhaarIssueDate
                      ? new Date(aadhaarIssueDate)
                      : new Date(),
                    expiry_date: aadhaarExpiryDate
                      ? new Date(aadhaarExpiryDate)
                      : null,
                    document_path: aadhaarPath || "",
                  },
                ]
              : []),
            ...(pan
              ? [
                  {
                    document_type: "PAN",
                    document_number: pan,
                    approval_status: "PENDING",
                    issue_date: panIssueDate
                      ? new Date(panIssueDate)
                      : new Date(),
                    expiry_date: panExpiryDate ? new Date(panExpiryDate) : null,
                    document_path: panPath || "",
                  },
                ]
              : []),
          ],
        },
      },
      include: {
        emergencyContacts: true,
        documents: true,
      },
    });

    // const employees = await prisma.employee.findMany();
    // for (let employee of employees) {
    //   await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
    //     userIds: [employee.employee_id],
    //     title: "New Personal Details Submission",
    //     message: `Employee ${firstName} ${lastName} has submitted their personal details for review.`,
    //     priority: "NORMAL",
    //     redirectUrl: `${process.env.APP_URL}/employees/${userId}`,
    //     recipientType: "ADMIN",
    //   });
    // }
    console.log("THis is line manager Id:----------->??????&&&&&&&&&%%%%5",existingEmployee);
    await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
      userIds: [existingEmployee?.employment?.manager_id],
      title: "New Personal Details Submission",
      message: `Employee ${firstName} ${lastName} has submitted their personal details.`,
      priority: "NORMAL",
      redirectUrl: `${process.env.APP_URL}/employees/${userId}`,
      recipientType: "ADMIN",
    });

    return {
      status: 201,
      data: {
        message: "Personal details submitted for review.",
        submission: personalSubmission,
      },
    };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: 500, data: { error: "Internal Server Error" } };
  }
};

// const validateEmployeeData = (data) => {
//   const errors = {};
//   const phoneRegex = /^[6-9]\d{9}$/;
//   const aadharRegex = /^\d{12}$/;
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//   const uanPfEsicRegex = /^\d{12}$/;
//   const accountNumberRegex = /^\d{8,18}$/;

//   const { personalDetails, employmentDetails, bankDetails } = data;

//   // **Personal Details Validation**
//   if (!personalDetails.name?.trim()) {
//     errors.name = "Name is required";
//   }
//   if (!personalDetails.gender?.trim()) {
//     errors.gender = "Gender is required";
//   }
//   if (!personalDetails.location?.trim()) {
//     errors.location = "Location is required";
//   }
//   if (!personalDetails.dateOfBirth) {
//     errors.dateOfBirth = "Date of Birth is required";
//   }
//   if (!personalDetails.bloodGroup?.trim()) {
//     errors.bloodGroup = "Blood group is required";
//   }
//   if (!personalDetails.personalEmail || !emailRegex.test(personalDetails.personalEmail)) {
//     errors.personalEmail = "Invalid email format";
//   }
//   if (!personalDetails.phoneNumber || !phoneRegex.test(personalDetails.phoneNumber)) {
//     errors.phoneNumber = "Invalid phone number (10 digits required)";
//   }
//   if (!personalDetails.maritalStatus?.trim()) {
//     errors.maritalStatus = "Marital status is required";
//   }
//   if (!personalDetails.aadharNumber || !aadharRegex.test(personalDetails.aadharNumber)) {
//     errors.aadharNumber = "Aadhar must be 12 digits";
//   }
//   if (!personalDetails.panNumber || !panRegex.test(personalDetails.panNumber)) {
//     errors.panNumber = "PAN format invalid (e.g., ABCDE1234F)";
//   }
//   if (!personalDetails.currentAddress?.trim()) {
//     errors.currentAddress = "Current address is required";
//   }
//   if (!personalDetails.permanentAddress?.trim()) {
//     errors.permanentAddress = "Permanent address is required";
//   }

//   // **Employment Details Validation**
//   if (!employmentDetails.employeeId?.trim()) {
//     errors.employeeId = "Employee ID is required";
//   }
//   if (!employmentDetails.jobTitle?.trim()) {
//     errors.jobTitle = "Job title is required";
//   }
//   if (!employmentDetails.location?.trim()) {
//     errors.location = "Location is required";
//   }
//   if (!employmentDetails.officeEmail || !emailRegex.test(employmentDetails.officeEmail)) {
//     errors.officeEmail = "Invalid office email format";
//   }
//   if (!employmentDetails.dateOfJoining) {
//     errors.dateOfJoining = "Date of Joining is required";
//   }
//   if (!employmentDetails.employmentType?.trim()) {
//     errors.employmentType = "Employment type is required";
//   }
//   if (!employmentDetails.uanNumber || !uanPfEsicRegex.test(employmentDetails.uanNumber)) {
//     errors.uanNumber = "UAN must be 12 digits";
//   }
//   if (!employmentDetails.pfNumber || !uanPfEsicRegex.test(employmentDetails.pfNumber)) {
//     errors.pfNumber = "PF number must be 12 digits";
//   }
//   if (!employmentDetails.esicNumber || !uanPfEsicRegex.test(employmentDetails.esicNumber)) {
//     errors.esicNumber = "ESIC number must be 12 digits";
//   }
//   if (!employmentDetails.lineManagerId) {
//     errors.lineManager = "Line manager selection is required";
//   }

//   // **Bank Details Validation**
//   if (!bankDetails.accountHolder?.trim()) {
//     errors.accountHolder = "Account holder name is required";
//   }
//   if (!bankDetails.bankName?.trim()) {
//     errors.bankName = "Bank name is required";
//   }
//   if (!bankDetails.ifscCode || !ifscRegex.test(bankDetails.ifscCode)) {
//     errors.ifscCode = "Invalid IFSC Code (11 characters, e.g., SBIN0001234)";
//   }
//   if (!bankDetails.accountNumber || !accountNumberRegex.test(bankDetails.accountNumber)) {
//     errors.accountNumber = "Account Number must be 8-18 digits";
//   }

//   return errors;
// };

const validateEmployeeData = (data) => {
  const errors = {};
  const phoneRegex = /^[6-9]\d{9}$/;
  const aadharRegex = /^\d{12}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const uanPfEsicRegex = /^\d{12}$/;
  const accountNumberRegex = /^\d{8,18}$/;
  const postalCodeRegex = /^\d{6}$/; // Indian postal code

  const { personalDetails, employmentDetails, bankDetails } = data;

  // **Personal Details Validation**
  if (!personalDetails.name?.trim()) {
    errors.name = "Name is required";
  }
  if (!personalDetails.gender?.trim()) {
    errors.gender = "Gender is required";
  }
  // if (!personalDetails.location?.trim()) {
  //   errors.location = "Location is required";
  // }
  if (!personalDetails.dateOfBirth) {
    errors.dateOfBirth = "Date of Birth is required";
  }
  if (!personalDetails.bloodGroup?.trim()) {
    errors.bloodGroup = "Blood group is required";
  }
  if (
    !personalDetails.personalEmail ||
    !emailRegex.test(personalDetails.personalEmail)
  ) {
    errors.personalEmail = "Invalid email format";
  }
  if (
    !personalDetails.phoneNumber ||
    !phoneRegex.test(personalDetails.phoneNumber)
  ) {
    errors.phoneNumber = "Invalid phone number (10 digits required)";
  }
  if (!personalDetails.maritalStatus?.trim()) {
    errors.maritalStatus = "Marital status is required";
  }
  if (
    !personalDetails.aadharNumber ||
    !aadharRegex.test(personalDetails.aadharNumber)
  ) {
    errors.aadharNumber = "Aadhar must be 12 digits";
  }
  if (!personalDetails.panNumber || !panRegex.test(personalDetails.panNumber)) {
    errors.panNumber = "PAN format invalid (e.g., ABCDE1234F)";
  }

  // Current Address validation
  if (!personalDetails.currentAddress?.street?.trim()) {
    errors.currentAddressStreet = "Street address is required";
  }
  if (!personalDetails.currentAddress?.city?.trim()) {
    errors.currentAddressCity = "City is required";
  }
  if (!personalDetails.currentAddress?.state?.trim()) {
    errors.currentAddressState = "State is required";
  }
  if (!personalDetails.currentAddress?.zipCode?.trim()) {
    errors.currentAddressPostalCode = "Postal code is required";
  } else if (!postalCodeRegex.test(personalDetails.currentAddress.zipCode)) {
    errors.currentAddressPostalCode = "Postal code must be 6 digits";
  }
  if (!personalDetails.currentAddress?.country?.trim()) {
    errors.currentAddressCountry = "Country is required";
  }

  // Permanent Address validation
  if (!personalDetails.permanentAddress?.street?.trim()) {
    errors.permanentAddressStreet = "Street address is required";
  }
  if (!personalDetails.permanentAddress?.city?.trim()) {
    errors.permanentAddressCity = "City is required";
  }
  if (!personalDetails.permanentAddress?.state?.trim()) {
    errors.permanentAddressState = "State is required";
  }
  if (!personalDetails.permanentAddress?.zipCode?.trim()) {
    errors.permanentAddressPostalCode = "Postal code is required";
  } else if (!postalCodeRegex.test(personalDetails.permanentAddress.zipCode)) {
    errors.permanentAddressPostalCode = "Postal code must be 6 digits";
  }
  if (!personalDetails.permanentAddress?.country?.trim()) {
    errors.permanentAddressCountry = "Country is required";
  }

  // **Employment Details Validation**
  if (!employmentDetails.employeeId?.trim()) {
    errors.employeeId = "Employee ID is required";
  }
  if (!employmentDetails.jobTitle?.trim()) {
    errors.jobTitle = "Job title is required";
  }
  if (!employmentDetails.department?.trim()) {
    errors.department = "Department is required";
  }
  // if (!employmentDetails.location?.trim()) {
  //   errors.employmentLocation = "Location is required";
  // }
  if (
    !employmentDetails.officeEmail ||
    !emailRegex.test(employmentDetails.officeEmail)
  ) {
    errors.officeEmail = "Invalid office email format";
  }
  if (!employmentDetails.dateOfJoining) {
    errors.dateOfJoining = "Date of Joining is required";
  }
  if (!employmentDetails.employmentType?.trim()) {
    errors.employmentType = "Employment type is required";
  }
  if (
    !employmentDetails.uanNumber ||
    !uanPfEsicRegex.test(employmentDetails.uanNumber)
  ) {
    errors.uanNumber = "UAN must be 12 digits";
  }
  if (
    !employmentDetails.pfNumber ||
    !uanPfEsicRegex.test(employmentDetails.pfNumber)
  ) {
    errors.pfNumber = "PF number must be 12 digits";
  }
  if (
    !employmentDetails.esicNumber ||
    !uanPfEsicRegex.test(employmentDetails.esicNumber)
  ) {
    errors.esicNumber = "ESIC number must be 12 digits";
  }
  if (!employmentDetails.lineManagerId) {
    errors.lineManager = "Line manager selection is required";
  }

  // **Bank Details Validation**
  if (!bankDetails.accountHolder?.trim()) {
    errors.accountHolder = "Account holder name is required";
  }
  if (!bankDetails.bankName?.trim()) {
    errors.bankName = "Bank name is required";
  }
  if (!bankDetails.ifscCode || !ifscRegex.test(bankDetails.ifscCode)) {
    errors.ifscCode = "Invalid IFSC Code (11 characters, e.g., SBIN0001234)";
  }
  if (
    !bankDetails.accountNumber ||
    !accountNumberRegex.test(bankDetails.accountNumber)
  ) {
    errors.accountNumber = "Account Number must be 8-18 digits";
  }

  return errors;
};

// exports.updateAllEmployeeDetails = async (id, data) => {
//   const errors = validateEmployeeData(data);

//   if (Object.keys(errors).length > 0) {
//     throw new Error(JSON.stringify({ status: 400, errors }));
//   }
//   const {
//     personalDetails = {},
//     employmentDetails = {},
//     bankDetails = {},
//     emergencyContact = {},
//     documents = [],
//   } = data;

//   console.log(data);

//   try {
//     // Update Employee Personal Details
//     const updatedEmployee = await prisma.employee.update({
//       where: { employee_id: id },
//       data: {
//         first_name: personalDetails.name?.split(" ")[0] || "Unknown",
//         last_name: personalDetails.name?.split(" ")[1] || "",
//         date_of_birth: personalDetails.dateOfBirth
//           ? new Date(personalDetails.dateOfBirth)
//           : new Date("2000-01-01"),
//         gender: personalDetails.gender || "Not Specified",
//         phone_number: personalDetails.phoneNumber || "0000000000",
//         alternate_phone_number:
//           personalDetails.alternatePhoneNumber || "0000000000",
//         email: personalDetails.personalEmail || "unknown@example.com",
//         current_address: personalDetails.currentAddress || "Not Available",
//         permanent_address: personalDetails.permanentAddress || "Not Available",
//         city: personalDetails.location || "Unknown",
//         nationality: personalDetails.nationality || "Unknown",
//         marital_status: personalDetails.maritalStatus || "Unknown",
//         blood_group: personalDetails.bloodGroup || "Unknown",
//         approval_status: personalDetails.approvalStatus || "APPROVED",
//       },
//     });

//     // Update Employment Details
//     await prisma.employment.upsert({
//       where: { employee_id: id },
//       update: {
//         designation: employmentDetails.jobTitle || "Not Assigned",
//         department: employmentDetails.department || "General",
//         date_of_joining: employmentDetails.dateOfJoining
//           ? new Date(employmentDetails.dateOfJoining)
//           : new Date(),
//         employment_type: employmentDetails.employmentType || "FULL_TIME",
//         manager_id:
//           employmentDetails.manager_id || employmentDetails.lineManagerId || null,
//         work_location: employmentDetails.location || "Head Office",
//         status: employmentDetails.status || "ACTIVE",
//         base_salary: employmentDetails.base_salary || 30000, // Default salary
//         stock_bonus: employmentDetails.stock_bonus || 0,
//         official_email:
//           employmentDetails.officeEmail || `employee${id}@company.com`,
//         termination_date: employmentDetails.termination_date
//           ? new Date(employmentDetails.termination_date)
//           : null,
//         updated_at: new Date(),
//       },
//       create: {
//         employee_id: id,
//         designation: employmentDetails.jobTitle || "Not Assigned",
//         department: employmentDetails.department || "General",
//         date_of_joining: employmentDetails.dateOfJoining
//           ? new Date(employmentDetails.dateOfJoining)
//           : new Date(),
//         employment_type: employmentDetails.employmentType || "FULL_TIME",
//         manager_id:
//           employmentDetails.manager_id || employmentDetails.lineManagerId || null,
//         work_location: employmentDetails.location || "Head Office",
//         status: employmentDetails.status || "ACTIVE",
//         base_salary: employmentDetails.base_salary || 30000,
//         stock_bonus: employmentDetails.stock_bonus || 0,
//         official_email:
//           employmentDetails.officeEmail || `employee${id}@company.com`,
//         termination_date: employmentDetails.termination_date
//           ? new Date(employmentDetails.termination_date)
//           : null,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     });

//     // Update Bank Details
//     if (Object.keys(bankDetails).length > 0) {
//       // First, delete existing bank details for this employee
//       await prisma.bank.deleteMany({
//         where: { employee_id: id },
//       });

//       // Insert new bank details
//       await prisma.bank.create({
//         data: {
//           employee_id: id,
//           bank_name: bankDetails.bankName || "Default Bank",
//           account_number: bankDetails.accountNumber || "0000000000",
//           ifsc_code: bankDetails.ifscCode || "DEFAULT0000",
//           branch_name: bankDetails.branchName || "Main Branch",
//           account_type: bankDetails.accountType || "SAVINGS",
//           account_holder_name:
//             bankDetails.accountHolderName ||
//             bankDetails.accountHolder ||
//             "Unknown Holder",
//           created_at: new Date(),
//           updated_at: new Date(),
//         },
//       });
//     } else {
//       console.warn("Bank details missing, skipping update.");
//     }

//     // Update Emergency Contact
//     if (Object.keys(emergencyContact).length > 0) {
//       await prisma.emergency.upsert({
//         where: { contact_id: emergencyContact.id || id },
//         update: {
//           contact_name: emergencyContact.name || "Not Provided",
//           contact_phone: emergencyContact.phoneNumber || "0000000000",
//           relationship: emergencyContact.relationship || "Not Specified",
//         },
//         create: {
//           employee_id: id,
//           contact_name: emergencyContact.name || "Not Provided",
//           contact_phone: emergencyContact.phoneNumber || "0000000000",
//           relationship: emergencyContact.relationship || "Not Specified",
//           contact_email: "",
//           approval_status: "APPROVED",
//         },
//       });
//     }

//     const Newdocuments = [];
//     if (employmentDetails?.uanNumber) {
//       Newdocuments.push({
//         documentType: "UAN",
//         documentNumber: employmentDetails.uanNumber,
//         documentPath: "",
//         approvalStatus: "APPROVED",
//       });
//     }

//     if (employmentDetails?.pfNumber) {
//       Newdocuments.push({
//         documentType: "PF",
//         documentNumber: employmentDetails.pfNumber,
//         documentPath: "",
//         approvalStatus: "APPROVED",
//       });
//     }

//     if (employmentDetails?.esicNumber) {
//       Newdocuments.push({
//         documentType: "ESIC",
//         documentNumber: employmentDetails.esicNumber,
//         documentPath: "",
//         approvalStatus: "APPROVED",
//       });
//     }

//     if (personalDetails?.aadharNumber) {
//       Newdocuments.push({
//         documentType: "AADHAAR",
//         documentNumber: personalDetails.aadharNumber,
//         documentPath: "",
//         approvalStatus: "APPROVED",
//       });
//     }

//     if (personalDetails?.panNumber) {
//       Newdocuments.push({
//         documentType: "PAN",
//         documentNumber: personalDetails.panNumber,
//         documentPath: "",
//         approvalStatus: "APPROVED",
//       });
//     }

//     // Fetch all existing documents of the same types
//     const existingDocs = await prisma.document.findMany({
//       where: {
//         employee_id: id,
//         document_type: { in: Newdocuments.map((doc) => doc.documentType) },
//       },
//     });
//     console.log(existingDocs);
//     // Delete all existing documents of the same types
//     if (existingDocs.length > 0) {
//       console.log("Entered");
//       await prisma.document.deleteMany({
//         where: {
//           document_id: { in: existingDocs.map((doc) => doc.document_id) },
//         },
//       });
//     }
//     console.log("current.........", Newdocuments);
//     // Insert new documents
//     await prisma.document.createMany({
//       data: Newdocuments.map((doc) => ({
//         employee_id: id,
//         document_type: doc.documentType,
//         document_number: doc.documentNumber,
//         document_path: doc.documentPath,
//         approval_status: doc.approvalStatus,
//         issue_date: new Date(),
//       })),
//     });

//     return updatedEmployee;
//   } catch (error) {
//     console.error("Error updating employee details:", error);
//     throw new Error("Internal server error");
//   }
// };

exports.updateAllEmployeeDetails = async (id, data) => {
  const errors = validateEmployeeData(data);

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify({ status: 400, errors }));
  }

  const {
    personalDetails = {},
    employmentDetails = {},
    bankDetails = {},
    emergencyContact = {},
    documents = [],
  } = data;

  console.log("THis is the data:------------>>><<>>", data);
  const existingEmployment = await prisma.employment.findUnique({
    where: { employee_id: id },
  });
  try {
    const current = personalDetails.currentAddress || {};
    const permanent = personalDetails.permanentAddress || {};

    // Update Employee Personal Details
    const updatedEmployee = await prisma.employee.update({
      where: { employee_id: id },
      data: {
        first_name: personalDetails.name?.split(" ")[0] || "Unknown",
        last_name: personalDetails.name?.split(" ")[1] || "",
        date_of_birth: personalDetails.dateOfBirth
          ? new Date(personalDetails.dateOfBirth)
          : new Date("2000-01-01"),
        gender: personalDetails.gender || "Not Specified",
        phone_number: personalDetails.phoneNumber || "0000000000",
        alternate_phone_number:
          personalDetails.alternatePhoneNumber || "0000000000",
        email: personalDetails.personalEmail || "unknown@example.com",
        nationality: personalDetails.nationality || "Unknown",
        marital_status: personalDetails.maritalStatus || "Unknown",
        blood_group: personalDetails.bloodGroup || "Unknown",
        approval_status: personalDetails.approvalStatus || "APPROVED",

        // New address fields
        current_street_details: current.street || "Not Available",
        current_city: current.city || "Unknown",
        current_state: current.state || "Unknown",
        current_country: current.country || "Unknown",
        current_zip: current.zipCode || "000000",

        permanent_street_details: permanent.street || "Not Available",
        permanent_city: permanent.city || "Unknown",
        permanent_state: permanent.state || "Unknown",
        permanent_country: permanent.country || "Unknown",
        permanent_zip: permanent.zipCode || "000000",
      },
    });

    // Update Employment Details
    await prisma.employment.upsert({
      where: { employee_id: id },
      update: {
        company_employee_id: Number(employmentDetails.companyEmployeeId) || 0,
        designation: employmentDetails.jobTitle || "Not Assigned",
        department: employmentDetails.department || "General",
        date_of_joining: employmentDetails.dateOfJoining
          ? new Date(employmentDetails.dateOfJoining)
          : new Date(),
        employment_type: employmentDetails.employmentType || "FULL_TIME",
        manager_id:
          employmentDetails.manager_id ||
          employmentDetails.lineManagerId ||
          null,
        work_location: employmentDetails.location || "Head Office",
        status: employmentDetails.status || "DEACTIVATED",
        base_salary: employmentDetails.base_salary || 30000,
        stock_bonus: employmentDetails.stock_bonus || 0,
        official_email:
          employmentDetails.officeEmail || `employee${id}@company.com`,
        termination_date: employmentDetails.termination_date
          ? new Date(employmentDetails.termination_date)
          : null,
        updated_at: new Date(),
      },
      create: {
        employee_id: id,
        company_employee_id: Number(employmentDetails.companyEmployeeId) || 0,
        designation: employmentDetails.jobTitle || "Not Assigned",
        department: employmentDetails.department || "General",
        date_of_joining: employmentDetails.dateOfJoining
          ? new Date(employmentDetails.dateOfJoining)
          : new Date(),
        employment_type: employmentDetails.employmentType || "FULL_TIME",
        manager_id:
          employmentDetails.manager_id ||
          employmentDetails.lineManagerId ||
          null,
        work_location: employmentDetails.location || "Head Office",
        status: employmentDetails.status || "DEACTIVATED",
        base_salary: employmentDetails.base_salary || 30000,
        stock_bonus: employmentDetails.stock_bonus || 0,
        official_email:
          employmentDetails.officeEmail || `employee${id}@company.com`,
        termination_date: employmentDetails.termination_date
          ? new Date(employmentDetails.termination_date)
          : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Update Bank Details
    if (Object.keys(bankDetails).length > 0) {
      await prisma.bank.deleteMany({
        where: { employee_id: id },
      });

      await prisma.bank.create({
        data: {
          employee_id: id,
          bank_name: bankDetails.bankName || "Default Bank",
          account_number: bankDetails.accountNumber || "0000000000",
          ifsc_code: bankDetails.ifscCode || "DEFAULT0000",
          branch_name: bankDetails.branchName || "Main Branch",
          account_type: bankDetails.accountType || "SAVINGS",
          account_holder_name:
            bankDetails.accountHolderName ||
            bankDetails.accountHolder ||
            "Unknown Holder",
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } else {
      console.warn("Bank details missing, skipping update.");
    }

    // Update Emergency Contact
    if (emergencyContact && Object.keys(emergencyContact).length > 0) {
      await prisma.emergency.upsert({
        where: { contact_id: emergencyContact.id || id },
        update: {
          contact_name: emergencyContact.name || "Not Provided",
          contact_phone: emergencyContact.phoneNumber || "0000000000",
          relationship: emergencyContact.relationship || "Not Specified",
        },
        create: {
          employee_id: id,
          contact_name: emergencyContact.name || "Not Provided",
          contact_phone: emergencyContact.phoneNumber || "0000000000",
          relationship: emergencyContact.relationship || "Not Specified",
          contact_email: "",
          approval_status: "APPROVED",
        },
      });
    }

    // Update Documents
    const Newdocuments = [];
    if (employmentDetails?.uanNumber) {
      Newdocuments.push({
        documentType: "UAN",
        documentNumber: employmentDetails.uanNumber,
        documentPath: "",
        approvalStatus: "APPROVED",
      });
    }
    if (employmentDetails?.pfNumber) {
      Newdocuments.push({
        documentType: "PF",
        documentNumber: employmentDetails.pfNumber,
        documentPath: "",
        approvalStatus: "APPROVED",
      });
    }
    if (employmentDetails?.esicNumber) {
      Newdocuments.push({
        documentType: "ESIC",
        documentNumber: employmentDetails.esicNumber,
        documentPath: "",
        approvalStatus: "APPROVED",
      });
    }
    if (personalDetails?.aadharNumber) {
      Newdocuments.push({
        documentType: "AADHAAR",
        documentNumber: personalDetails.aadharNumber,
        documentPath: "",
        approvalStatus: "APPROVED",
      });
    }
    if (personalDetails?.panNumber) {
      Newdocuments.push({
        documentType: "PAN",
        documentNumber: personalDetails.panNumber,
        documentPath: "",
        approvalStatus: "APPROVED",
      });
    }

    const existingDocs = await prisma.document.findMany({
      where: {
        employee_id: id,
        document_type: { in: Newdocuments.map((doc) => doc.documentType) },
      },
    });

    if (existingDocs.length > 0) {
      await prisma.document.deleteMany({
        where: {
          document_id: { in: existingDocs.map((doc) => doc.document_id) },
        },
      });
    }

    await prisma.document.createMany({
      data: Newdocuments.map((doc) => ({
        employee_id: id,
        document_type: doc.documentType,
        document_number: doc.documentNumber,
        document_path: doc.documentPath,
        approval_status: doc.approvalStatus,
        issue_date: new Date(),
      })),
    });
    const wasDeactivated = existingEmployment?.status === "DEACTIVATED";
    const isNowActive = employmentDetails?.status === "ACTIVE";
    
    if (wasDeactivated && isNowActive) {
      axios
        .post(
          `${UM_SERVICE_BASE_URL}/api/v1/auth/password-reset/request`,
          { email: employmentDetails.officeEmail }
        )
        .then((response) => {
          console.log("Email sent successfully", response.data, employmentDetails.officeEmail);
        })
        .catch((error) => {
          console.log("Error sending email to the user...", error, employmentDetails.officeEmail);
        });
    }
    

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating employee details:", error);
    throw new Error("Internal server error");
  }
};

// exports.updateApprovalStatus = async (id, approvalStatus) => {
//   try {
//     console.log("This is approval status", approvalStatus);

//     if (approvalStatus === "REJECTED") {
//       const existing = await prisma.personalDetailsSubmission.findFirst({
//         where: { user_id: id },
//         select: { id: true },
//       });

//       if (existing) {
//         console.log("Here in the existing..........");
//         await prisma.emergencySubmission.deleteMany({
//           where: { personal_details_id: existing.id },
//         });
//         await prisma.documentSubmission.deleteMany({
//           where: { personal_details_id: existing.id },
//         });
//         await prisma.personalDetailsSubmission.delete({
//           where: { id: existing.id },
//         });
//       }
//       console.log("It is not existing........");
//       return {
//         success: true,
//         message: "Submission and all related data deleted (REJECTED)",
//       };
//     }

//     // For APPROVED
//     const submission = await prisma.personalDetailsSubmission.findFirst({
//       where: { user_id: id },
//       include: {
//         emergencyContacts: true,
//         documents: true,
//       },
//     });

//     if (!submission) {
//       return {
//         success: false,
//         message: "No submission found with the given ID",
//       };
//     }

//     const {
//       user_id,
//       first_name,
//       last_name,
//       gender,
//       date_of_birth,
//       blood_group,
//       email,
//       phone_number,
//       alternate_phone_number,
//       current_address,
//       permanent_address,
//       city,
//       state,
//       country,
//       postal_code,
//       nationality,
//       marital_status,
//       profile_pic_url,
//     } = submission;

//     // Check if employee already exists
//     const existingEmployee = await prisma.employee.findUnique({
//       where: { employee_id: user_id },
//     });

//     let employee;

//     if (existingEmployee) {
//       // Only update personal fields, not emergency contacts or documents
//       employee = await prisma.employee.update({
//         where: { employee_id: user_id },
//         data: {
//           first_name,
//           last_name,
//           gender,
//           date_of_birth,
//           blood_group,
//           email,
//           phone_number,
//           alternate_phone_number,
//           current_address,
//           permanent_address,
//           city,
//           state,
//           country,
//           postal_code,
//           nationality,
//           marital_status,
//           profile_pic_url,
//           approval_status: "APPROVED",
//         },
//       });
//     } else {
//       // Create employee with all nested data
//       employee = await prisma.employee.create({
//         data: {
//           employee_id: user_id,
//           first_name,
//           last_name,
//           gender,
//           date_of_birth,
//           blood_group,
//           email,
//           phone_number,
//           alternate_phone_number,
//           current_address,
//           permanent_address,
//           city,
//           state,
//           country,
//           postal_code,
//           nationality,
//           marital_status,
//           profile_pic_url,
//           approval_status: "APPROVED",

//           emergencyContacts: {
//             create: submission.emergencyContacts.map((e) => ({
//               contact_name: e.contact_name,
//               relationship: e.relationship,
//               contact_phone: e.contact_phone,
//               contact_email: e.contact_email,
//               approval_status: "APPROVED",
//             })),
//           },

//           documents: {
//             create: submission.documents.map((d) => ({
//               document_type: d.document_type,
//               document_number: d.document_number,
//               approval_status: "APPROVED",
//               issue_date: d.issue_date,
//               expiry_date: d.expiry_date,
//               document_path: d.document_path,
//             })),
//           },
//         },
//       });
//     }

//     // Clean up submission data
//     await prisma.emergencySubmission.deleteMany({
//       where: { personal_details_id: submission.id },
//     });
//     await prisma.documentSubmission.deleteMany({
//       where: { personal_details_id: submission.id },
//     });
//     await prisma.personalDetailsSubmission.delete({
//       where: { id: submission.id },
//     });

//     return {
//       success: true,
//       message: "Submission approved and employee data processed",
//       employee,
//     };
//   } catch (error) {
//     console.error("Error updating approval status:", error);
//     throw new Error("Internal server error");
//   }
// };

exports.deleteEmployee = async (employeeId) => {
  // Delete in the order of dependencies
  await prisma.salary.deleteMany({ where: { employee_id: employeeId } });
  await prisma.bank.deleteMany({ where: { employee_id: employeeId } });
  await prisma.emergency.deleteMany({ where: { employee_id: employeeId } });
  await prisma.document.deleteMany({ where: { employee_id: employeeId } });
  await prisma.certification.deleteMany({ where: { employee_id: employeeId } });
  await prisma.employment.deleteMany({ where: { employee_id: employeeId } });

  // Finally, delete the employee
  await prisma.employee.delete({
    where: { employee_id: employeeId },
  });
};

exports.updateApprovalStatus = async (id, approvalStatus) => {
  try {
    console.log("This is approval status", approvalStatus);

    if (approvalStatus === "REJECTED") {
      const existing = await prisma.personalDetailsSubmission.findFirst({
        where: { user_id: id },
        select: { id: true },
      });

      if (existing) {
        console.log("Here in the existing..........");
        await prisma.emergencySubmission.deleteMany({
          where: { personal_details_id: existing.id },
        });
        await prisma.documentSubmission.deleteMany({
          where: { personal_details_id: existing.id },
        });
        await prisma.personalDetailsSubmission.delete({
          where: { id: existing.id },
        });
      }
      console.log("It is not existing........");
      return {
        success: true,
        message: "Submission and all related data deleted (REJECTED)",
      };
    }

    // For APPROVED
    const submission = await prisma.personalDetailsSubmission.findFirst({
      where: { user_id: id },
      include: {
        emergencyContacts: true,
        documents: true,
      },
    });

    if (!submission) {
      return {
        success: false,
        message: "No submission found with the given ID",
      };
    }

    const {
      user_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      blood_group,
      email,
      phone_number,
      alternate_phone_number,
      current_street_details,
      current_city,
      current_state,
      current_country,
      current_zip,
      permanent_street_details,
      permanent_city,
      permanent_state,
      permanent_country,
      permanent_zip,
      nationality,
      marital_status,
      profile_pic_url,
    } = submission;

    // Check if employee already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { employee_id: user_id },
    });

    let employee;

    if (existingEmployee) {
      // Only update personal fields, not emergency contacts or documents
      employee = await prisma.employee.update({
        where: { employee_id: user_id },
        data: {
          first_name,
          last_name,
          gender,
          date_of_birth,
          blood_group,
          email,
          phone_number,
          alternate_phone_number,
          current_street_details,
          current_city,
          current_state,
          current_country,
          current_zip,
          permanent_street_details,
          permanent_city,
          permanent_state,
          permanent_country,
          permanent_zip,
          nationality,
          marital_status,
          profile_pic_url,
          approval_status: "APPROVED",
        },
      });
    } else {
      // Create employee with all nested data
      employee = await prisma.employee.create({
        data: {
          employee_id: user_id,
          first_name,
          last_name,
          gender,
          date_of_birth,
          blood_group,
          email,
          phone_number,
          alternate_phone_number,
          current_street_details,
          current_city,
          current_state,
          current_country,
          current_zip,
          permanent_street_details,
          permanent_city,
          permanent_state,
          permanent_country,
          permanent_zip,
          nationality,
          marital_status,
          profile_pic_url,
          approval_status: "APPROVED",

          emergencyContacts: {
            create: submission.emergencyContacts.map((e) => ({
              contact_name: e.contact_name,
              relationship: e.relationship,
              contact_phone: e.contact_phone,
              contact_email: e.contact_email,
              approval_status: "APPROVED",
            })),
          },

          documents: {
            create: submission.documents.map((d) => ({
              document_type: d.document_type,
              document_number: d.document_number,
              approval_status: "APPROVED",
              issue_date: d.issue_date,
              expiry_date: d.expiry_date,
              document_path: d.document_path,
            })),
          },
        },
      });
    }

    // Clean up submission data
    await prisma.emergencySubmission.deleteMany({
      where: { personal_details_id: submission.id },
    });
    await prisma.documentSubmission.deleteMany({
      where: { personal_details_id: submission.id },
    });
    await prisma.personalDetailsSubmission.delete({
      where: { id: submission.id },
    });

    return {
      success: true,
      message: "Submission approved and employee data processed",
      employee,
    };
  } catch (error) {
    console.error("Error updating approval status:", error);
    throw new Error("Internal server error");
  }
};

exports.getEmploymentByUserId = async (userId) => {
  console.log(userId);
  return await prisma.employment.findUnique({
    where: { employee_id: userId },
    include: {
      employee: {
        include: { documents: true },
      },
    },
  });
};

exports.getBankDetailsByEmployeeId = async (employeeId) => {
  return await prisma.bank.findFirst({
    where: { employee_id: employeeId },
    select: {
      account_holder_name: true,
      bank_name: true,
      account_number: true,
      ifsc_code: true,
      account_type: true,
    },
  });
};

exports.logAndPrepare = async (employees) => {
  // You can later validate or transform here
  for (const emp of employees) {
    console.log(`Processing: ${emp.name} (${emp.email})`);
    // Future: transform + insert to DB
  }
};

const UM_SERVICE_URL =
  process.env.UM_SERVICE_URL || "http://localhost:5000/api/register-employee";
const DEFAULT_PASSWORD =
  process.env.DEFAULT_EMPLOYEE_PASSWORD || "Employee@123";
const API_BASE_URL_LM = `${process.env.API_BASE_URL_LM}`;
const UM_SERVICE_BASE_URL =
  process.env.UM_SERVICE_BASE_URL || "http://localhost:5000/um";
exports.importEmployees = async (employeeDataList) => {
  const skipped = [];
  const created = [];

  for (const employeeData of employeeDataList) {
    const email = employeeData?.employmentDetails?.officeEmail;
    if (!email) {
      console.log("Email is not valid");
      continue;
    }
    const existing = await prisma.employment.findUnique({
      where: { official_email: email },
    });

    if (existing) {
      console.log(`Email Id ${email} is skipped`);
      skipped.push(email);
      continue;
    }

    const {
      personalDetails = {},
      employmentDetails = {},
      bankDetails = {},
      emergencyContact = {},
      currentAddress = {},
      permanentAddress = {},
    } = employeeData;

    console.log("this is employee data:-", employeeData);

    try {
      // Step 1: Register user in User Management Service
      const registerResponse = await axios.post(`${UM_SERVICE_URL}`, {
        name: personalDetails?.name || "Employee",
        email,
        password: DEFAULT_PASSWORD,
      });

      const userId = registerResponse?.data?.userId;
      if (!userId) throw new Error("User ID not returned from User Management");

      // Step 2: Create employee in Employee DB
      const newEmployee = await prisma.employee.create({
        data: {
          employee_id: userId,
          first_name: personalDetails?.name || "N/A",
          last_name: "",
          date_of_birth: personalDetails?.dateOfBirth
            ? new Date(personalDetails.dateOfBirth)
            : new Date("1990-01-01"),
          gender: personalDetails?.gender || "OTHER",
          phone_number: personalDetails?.phoneNumber || "0000000000",
          email: personalDetails?.personalEmail || email,
          blood_group: personalDetails?.bloodGroup || undefined,
          marital_status: personalDetails?.maritalStatus || "SINGLE",
          nationality: "Indian",
          profile_pic_url: "",
          current_street_details: currentAddress?.street || undefined,
          current_city: currentAddress?.city || undefined,
          current_state: currentAddress?.state || undefined,
          current_country: currentAddress?.country || undefined,
          current_zip: currentAddress?.zipCode || undefined,
          permanent_street_details: permanentAddress?.street || undefined,
          permanent_city: permanentAddress?.city || undefined,
          permanent_state: permanentAddress?.state || undefined,
          permanent_country: permanentAddress?.country || undefined,
          permanent_zip: permanentAddress?.zipCode || undefined,
          employment: {
            create: {
              company_name: "Galvinus",
              company_employee_id:
                Number(employmentDetails?.companyEmployeeId) || null,
              official_email: employmentDetails?.officeEmail,
              designation: employmentDetails?.jobTitle || "N/A",
              department: employmentDetails?.department || "N/A",
              work_location: employmentDetails?.location || "N/A",
              date_of_joining: employmentDetails?.dateOfJoining
                ? new Date(employmentDetails.dateOfJoining)
                : new Date(),
              status: employeeData?.status || "DEACTIVATED",
              base_salary: 0,
              stock_bonus: 0,
              employment_type: employmentDetails?.employmentType || "FULL_TIME",
              manager_id: employmentDetails?.lineManagerId || null,
            },
          },
          bankAccounts: bankDetails?.accountNumber
            ? {
                create: {
                  bank_name: bankDetails?.bankName || "",
                  account_number: bankDetails?.accountNumber,
                  ifsc_code: bankDetails?.ifscCode || "",
                  branch_name: "",
                  account_type: "SAVINGS",
                  account_holder_name: bankDetails?.accountHolder || "",
                },
              }
            : undefined,
          emergencyContacts: emergencyContact?.phoneNumber
            ? {
                create: {
                  contact_name: personalDetails?.name || "",
                  relationship: "N/A",
                  contact_phone: emergencyContact.phoneNumber,
                  contact_email: personalDetails?.personalEmail || "",
                },
              }
            : undefined,
          documents: {
            create: [
              personalDetails?.aadharNumber && {
                document_type: "AADHAAR",
                document_number: personalDetails.aadharNumber,
                issue_date: new Date(),
                document_path: "",
              },
              personalDetails?.panNumber && {
                document_type: "PAN",
                document_number: personalDetails.panNumber,
                issue_date: new Date(),
                document_path: "",
              },
              employmentDetails?.pfNumber && {
                document_type: "PF",
                document_number: employmentDetails.pfNumber,
                issue_date: new Date(),
                document_path: "",
              },
              employmentDetails?.uanNumber && {
                document_type: "UAN",
                document_number: employmentDetails.uanNumber,
                issue_date: new Date(),
                document_path: "",
              },
            ].filter(Boolean),
          },
        },
      });

      const employeeId = userId; // replace with actual ID
      console.log("This employeeId is from employeeService", employeeId);
      console.log(
        "This employeeId is from new employee",
        newEmployee.employee_id
      );
      const leaveTypes = [
        { leaveType: "CASUAL", defaultBalance: 15 },
        { leaveType: "SICK", defaultBalance: 5 },
        { leaveType: "UNPAID", defaultBalance: 0 },
      ];

      axios
        .post(
          `${API_BASE_URL_LM}/api/leave-balance/createBalance/${newEmployee.employee_id}`,
          leaveTypes
        )
        .then((response) => {
          console.log("Leave balance created:", response.data);
        })
        .catch((error) => {
          console.error("Error creating leave balance:", error);
        });

      axios
        .post(
          `${UM_SERVICE_BASE_URL}/api/v1/auth/password-reset/request`,
          email
        )
        .then((response) => {
          console.log("email sent successfully", response.data);
        })
        .catch((error) => {
          console.log("Error sending email to the user....", error);
        });

      // return { message: "Employee created successfully", employee: newEmployee };

      created.push(newEmployee.email);
    } catch (err) {
      console.error(`❌ Failed to import employee ${email}:`, err.message);
      skipped.push(email);
    }
  }

  return { skipped, created };
};

exports.createSingleEmployee = async (employeeData) => {
  const {
    personalDetails = {},
    employmentDetails = {},
    bankDetails = {},
    emergencyContact = {},
    currentAddress = {},
    permanentAddress = {},
  } = employeeData;

  console.log("This is inside createSingleEmployee ", employeeData);

  const email = employmentDetails?.officeEmail;

  if (!email) throw new Error("Office Email is required");

  // Check if already exists
  const existing = await prisma.employment.findUnique({
    where: { official_email: email },
  });
  if (existing) throw new Error(`Employee with email ${email} already exists`);

  try {
    // Step 1: Register user
    const registerResponse = await axios.post(`${UM_SERVICE_URL}`, {
      name: personalDetails?.name || "Employee",
      email,
      password: DEFAULT_PASSWORD,
    });

    const userId = registerResponse?.data?.userId;
    console.log("THis is from um", userId);
    if (!userId) throw new Error("User ID not returned from User Management");

    // Step 2: Create Employee in DB
    const newEmployee = await prisma.employee.create({
      data: {
        employee_id: userId,
        first_name: personalDetails?.name || "N/A",
        last_name: "",
        date_of_birth: personalDetails?.dateOfBirth
          ? new Date(personalDetails.dateOfBirth)
          : new Date("1990-01-01"),
        gender: personalDetails?.gender || "OTHER",
        phone_number: personalDetails?.phoneNumber || "0000000000",
        email: personalDetails?.personalEmail || email,
        blood_group: personalDetails?.bloodGroup || undefined,
        marital_status: personalDetails?.maritalStatus || "SINGLE",
        nationality: "Indian",
        profile_pic_url: personalDetails?.profilePicture || "",
        current_street_details: currentAddress?.street || undefined,
        current_city: currentAddress?.city || undefined,
        current_state: currentAddress?.state || undefined,
        current_country: currentAddress?.country || undefined,
        current_zip: currentAddress?.zipCode || undefined,
        permanent_street_details: permanentAddress?.street || undefined,
        permanent_city: permanentAddress?.city || undefined,
        permanent_state: permanentAddress?.state || undefined,
        permanent_country: permanentAddress?.country || undefined,
        permanent_zip: permanentAddress?.zipCode || undefined,

        employment: {
          create: {
            company_name: "Galvinus",
            company_employee_id:
              Number(employmentDetails?.companyEmployeeId) || null,
            official_email: employmentDetails?.officeEmail,
            designation: employmentDetails?.jobTitle || "N/A",
            department: employmentDetails?.department || "N/A",
            work_location: employmentDetails?.location || "N/A",
            date_of_joining: employmentDetails?.dateOfJoining
              ? new Date(employmentDetails.dateOfJoining)
              : new Date(),
            status: employeeData?.status || "DEACTIVATED",
            base_salary: parseFloat(employmentDetails?.baseSalary || 0),
            stock_bonus: parseFloat(employmentDetails?.stockBonus || 0),
            employment_type: employmentDetails?.employmentType || "FULL_TIME",
            manager_id: employmentDetails?.lineManagerId || null,
          },
        },

        bankAccounts: bankDetails?.accountNumber
          ? {
              create: {
                bank_name: bankDetails?.bankName || "",
                account_number: bankDetails?.accountNumber,
                ifsc_code: bankDetails?.ifscCode || "",
                branch_name: "",
                account_type: "SAVINGS",
                account_holder_name: bankDetails?.accountHolder || "",
              },
            }
          : undefined,

        emergencyContacts: emergencyContact?.phoneNumber
          ? {
              create: {
                contact_name: personalDetails?.name || "",
                relationship: "N/A",
                contact_phone: emergencyContact.phoneNumber,
                contact_email: personalDetails?.personalEmail || "",
              },
            }
          : undefined,

        documents: {
          create: [
            personalDetails?.aadharNumber && {
              document_type: "AADHAAR",
              document_number: personalDetails.aadharNumber,
              issue_date: new Date(),
              document_path: "",
            },
            personalDetails?.panNumber && {
              document_type: "PAN",
              document_number: personalDetails.panNumber,
              issue_date: new Date(),
              document_path: "",
            },
            employmentDetails?.pfNumber && {
              document_type: "PF",
              document_number: employmentDetails.pfNumber,
              issue_date: new Date(),
              document_path: "",
            },
            employmentDetails?.uanNumber && {
              document_type: "UAN",
              document_number: employmentDetails.uanNumber,
              issue_date: new Date(),
              document_path: "",
            },
            employmentDetails?.esicNumber && {
              document_type: "ESIC",
              document_number: employmentDetails.esicNumber,
              issue_date: new Date(),
              document_path: "",
            },
          ].filter(Boolean),
        },
      },
    });

    // /lm/api/leave-balance/createBalance

    //   const leaveTypes = [
    //     { leaveType: 'CASUAL', defaultBalance: 15 },
    //     { leaveType: 'SICK', defaultBalance: 5 }
    // ];

    const employeeId = userId; // replace with actual ID
    console.log("This employeeId is from employeeService", employeeId);
    console.log(
      "This employeeId is from new employee",
      newEmployee.employee_id
    );
    const leaveTypes = [
      { leaveType: "CASUAL", defaultBalance: 15 },
      { leaveType: "SICK", defaultBalance: 5 },
      { leaveType: "UNPAID", defaultBalance: 0 },
    ];

    axios
      .post(
        `${API_BASE_URL_LM}/api/leave-balance/createBalance/${newEmployee.employee_id}`,
        leaveTypes
      )
      .then((response) => {
        console.log("Leave balance created:", response.data);
      })
      .catch((error) => {
        console.error("Error creating leave balance:", error);
      });

    console.log("This is employment stata:--->", employmentDetails?.status);

    if (employeeData?.status == "ACTIVE") {
      axios
        .post(
          `${UM_SERVICE_BASE_URL}/api/v1/auth/password-reset/request`,
          email
        )
        .then((response) => {
          console.log("email sent successfully", response.data);
        })
        .catch((error) => {
          console.log("Error sending email to the user....", error, email);
        });
    }

    return { message: "Employee created successfully", employee: newEmployee };
  } catch (error) {
    console.error("❌ Error creating single employee:", error.message);
    throw error;
  }
};
