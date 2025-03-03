const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
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
      name: `${emp.first_name} ${emp.last_name}`,
      email: emp.email,
      phone: emp.phone_number, // You may also want to include alternate_phone_number if relevant
      alternatePhone: emp.alternate_phone_number, // New field added
      department: emp.employment?.department || "N/A",
      designation: emp.employment?.designation || "N/A",
      location: emp.employment?.work_location || "N/A",
      joinDate: emp.employment?.date_of_joining.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      avatar: emp.profile_pic_url,
      status: emp.employment?.status || "N/A",
      approvalStatus: emp.approval_status || "PENDING", // Include approval status if needed
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
};

exports.fetchEmployeeDetailsById = async (employeeId) => {
  return await prisma.employee
    .findUnique({
      where: { employee_id: employeeId },
      include: {
        employment: true,
        bankAccounts: true,
        emergencyContacts: true,
        documents: true, // Ensure documents are included
      },
    })
    .then(async (employee) => {
      if (!employee) return null;

      // Extract manager_id from employment
      const managerId = employee.employment?.manager_id;
      let managerName = null;
      console.log("111111111111111111122222222", managerId);
      // Fetch manager name if managerId exists
      if (managerId) {
        const manager = await prisma.employee.findUnique({
          where: { employee_id: managerId },
          select: { first_name: true, last_name: true },
        });
        console.log("1111111111111111111", manager);
        if (manager) {
          managerName = `${manager.first_name} ${manager.last_name}`;
        }
      }

      // Extract Aadhar, PAN, PF, and UAN numbers from documents
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
      // ${employee.city}, ${employee?.state}, ${employee?.country} - ${employee?.postal_code}
      return {
        id: employee.employee_id,
        personalDetails: {
          name: `${employee.first_name} ${employee.last_name}`,
          gender: employee.gender,
          location: employee.city,
          dateOfBirth: employee.date_of_birth.toISOString().split("T")[0],
          phoneNumber: employee.phone_number,
          alternatePhoneNumber: employee.alternate_phone_number,
          personalEmail: employee.email,
          maritalStatus: employee.marital_status,
          currentAddress: `${employee.current_address}`,
          permanentAddress: employee.permanent_address,
          nationality: employee.nationality,
          bloodGroup: employee.blood_group,
          approvalStatus: employee.approval_status || "PENDING",
          aadharNumber: aadharDoc ? aadharDoc.document_number : null,
          panNumber: panDoc ? panDoc.document_number : null,
        },
        employmentDetails: {
          id: employee.employment?.employee_id,
          employeeId: employee.employee_id,
          jobTitle: employee.employment?.designation,
          department: employee.employment?.department,
          officeEmail: employee.employment?.official_email,
          dateOfJoining: employee.employment?.date_of_joining
            .toISOString()
            .split("T")[0],
          employmentType: employee.employment?.employment_type,
          location: employee.employment?.work_location,
          status: employee.employment?.status || "ACTIVE",
          // pfNumber:
          //   employee.employment?.pf_number ||
          //   (pfDoc ? pfDoc.document_number : null),
          // uanNumber:
          //   employee.employment?.uan_number ||
          //   (uanDoc ? uanDoc.document_number : null),
          lineManager: managerName,
          lineManagerId: employee.employment?.manager_id,
          pfNumber: pfDoc ? pfDoc.document_number : null,
          uanNumber: uanDoc ? uanDoc.document_number : null,
          esicNumber: esicDoc ? esicDoc.document_number : null,
        },
        bankDetails:
          employee.bankAccounts.length > 0
            ? {
                bankName: employee.bankAccounts[0].bank_name,
                // accountNumber: `****${employee.bankAccounts[0].account_number.slice(
                //   -4
                // )}`,
                accountNumber: `${employee.bankAccounts[0].account_number}`,
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
        // approvalStatus: employee.approval_status || "PENDING",
        documents: employee.documents.map((doc) => ({
          id: doc.document_id,
          documentType: doc.document_type,
          documentNumber: doc.document_number,
          documentPath: doc.document_path,
          approvalStatus: doc.approval_status || "PENDING",
        })),
        // Added Aadhar, PAN, PF, UAN, ESIC numbers
        // aadharNumber: aadharDoc ? aadharDoc.document_number : null,
        // panNumber: panDoc ? panDoc.document_number : null,
        // pfNumber: pfDoc ? pfDoc.document_number : null,
        // uanNumber: uanDoc ? uanDoc.document_number : null,
        // esicNumber: esicDoc ? esicDoc.document_number : null,
      };
    })
    .catch((error) => {
      console.error("Database error:", error);
      return null;
    });
};

exports.createPersonalDetails = async (data) => {
  console.log(data);
  try {
    const {
      signedUserId,
      name,
      gender,
      location,
      dateOfBirth,
      bloodGroup,
      email,
      phone,
      alternatePhone,
      emergencyContact,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactEmail,
      currentAddress,
      permanentAddress,
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
    // Validate signedUserId
    if (!signedUserId) {
      console.log("Here>>>")
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

    const userId = decoded.userId; // Extract userId from token payload

    if (!userId) {
      return {
        status: 401,
        data: { error: "Unauthorized: Invalid user ID in token" },
      };
    }

    // Check if an employee already exists for this userId
    const existingEmployee = await prisma.employee.findUnique({
      where: { employee_id: userId },
    });

    if (existingEmployee) {
      return {
        status: 400,
        data: { error: "Employee already exists for this user" },
      };
    }

    // Validate required fields
    if (!name || !email || !phone || !dateOfBirth) {
      return { status: 400, data: { error: "Required fields are missing." } };
    }

    // Split name into first and last name
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "";

    // Create employee record
    const newEmployee = await prisma.employee.create({
      data: {
        employee_id: userId,
        first_name: firstName,
        last_name: lastName,
        gender: gender?.toUpperCase() || "UNKNOWN",
        city: "Silchar",
        state: "Assam",
        country: "India",
        postal_code: "788111",
        date_of_birth: new Date(dateOfBirth),
        blood_group: bloodGroup,
        email,
        phone_number: phone,
        alternate_phone_number: alternatePhone,
        current_address: currentAddress,
        permanent_address: permanentAddress,
        marital_status: maritalStatus?.toUpperCase() || "UNKNOWN",
        nationality: "Indian",
        approval_status: "PENDING",
        profile_pic_url: "",

        emergencyContacts: {
          create: emergencyContact
            ? [
                {
                  contact_phone: emergencyContact,
                  contact_name: emergencyContactName || "UNKNOWN",
                  relationship: emergencyContactRelationship || "UNKNOWN",
                  contact_email: emergencyContactEmail || "",
                  approval_status: "PENDING", // Ensure uppercase
                },
              ]
            : [],
        },

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
          ].map((doc) => ({
            ...doc,
            document_type: doc.document_type.toUpperCase(),
            approval_status: doc.approval_status.toUpperCase(),
          })),
        },
      },
      include: {
        emergencyContacts: true,
        documents: true,
      },
    });

    return {
      status: 201,
      data: {
        message: "Employee details submitted successfully",
        employee: newEmployee,
      },
    };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: 500, data: { error: "Internal Server Error" } };
  }
};


// exports.createPersonalDetails = async (data) => {
//   console.log(data);
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
//       console.log("Here>>>");
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

//     // Validate required fields
//     if (!name || !email || !phone || !dateOfBirth) {
//       return { status: 400, data: { error: "Required fields are missing." } };
//     }

//     // Split name into first and last name
//     const [firstName, ...lastNameParts] = name.split(" ");
//     const lastName = lastNameParts.join(" ") || "";

//     // Use upsert to either create or update the employee record
//     const newEmployee = await prisma.employee.upsert({
//       where: { employee_id: userId }, // Check if employee exists
//       update: {
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
//       },
//       create: {
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
//       },
//       include: {
//         emergencyContacts: true,
//         documents: true,
//       },
//     });

//     // Handle emergency contacts using upsert (optional, but recommended)
//     if (emergencyContact) {
//       await prisma.emergencyContact.upsert({
//         where: {
//           employee_id_contact_phone: {
//             employee_id: userId,
//             contact_phone: emergencyContact,
//           },
//         },
//         update: {
//           contact_name: emergencyContactName || "UNKNOWN",
//           relationship: emergencyContactRelationship || "UNKNOWN",
//           contact_email: emergencyContactEmail || "",
//           approval_status: "PENDING",
//         },
//         create: {
//           employee_id: userId,
//           contact_phone: emergencyContact,
//           contact_name: emergencyContactName || "UNKNOWN",
//           relationship: emergencyContactRelationship || "UNKNOWN",
//           contact_email: emergencyContactEmail || "",
//           approval_status: "PENDING",
//         },
//       });
//     }

//     // Handle documents using upsert
//     const documentsToUpsert = [
//       ...(aadhaar
//         ? [
//             {
//               document_type: "AADHAAR",
//               document_number: aadhaar,
//               issue_date: aadhaarIssueDate ? new Date(aadhaarIssueDate) : new Date(),
//               expiry_date: aadhaarExpiryDate ? new Date(aadhaarExpiryDate) : null,
//               document_path: aadhaarPath || "",
//             },
//           ]
//         : []),
//       ...(pan
//         ? [
//             {
//               document_type: "PAN",
//               document_number: pan,
//               issue_date: panIssueDate ? new Date(panIssueDate) : new Date(),
//               expiry_date: panExpiryDate ? new Date(panExpiryDate) : null,
//               document_path: panPath || "",
//             },
//           ]
//         : []),
//     ];

//     for (const doc of documentsToUpsert) {
//       await prisma.document.upsert({
//         where: {
//           employee_id_document_type: {
//             employee_id: userId,
//             document_type: doc.document_type.toUpperCase(),
//           },
//         },
//         update: {
//           document_number: doc.document_number,
//           issue_date: doc.issue_date,
//           expiry_date: doc.expiry_date,
//           document_path: doc.document_path,
//           approval_status: "PENDING",
//         },
//         create: {
//           employee_id: userId,
//           document_type: doc.document_type.toUpperCase(),
//           document_number: doc.document_number,
//           issue_date: doc.issue_date,
//           expiry_date: doc.expiry_date,
//           document_path: doc.document_path,
//           approval_status: "PENDING",
//         },
//       });
//     }

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








const validateEmployeeData = (data) => {
  const errors = {};
  const phoneRegex = /^[6-9]\d{9}$/;
  const aadharRegex = /^\d{12}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const uanPfEsicRegex = /^\d{12}$/;
  const accountNumberRegex = /^\d{8,18}$/;

  const { personalDetails, employmentDetails, bankDetails } = data;

  // **Personal Details Validation**
  if (!personalDetails.name?.trim()) {
    errors.name = "Name is required";
  }
  if (!personalDetails.gender?.trim()) {
    errors.gender = "Gender is required";
  }
  if (!personalDetails.location?.trim()) {
    errors.location = "Location is required";
  }
  if (!personalDetails.dateOfBirth) {
    errors.dateOfBirth = "Date of Birth is required";
  }
  if (!personalDetails.bloodGroup?.trim()) {
    errors.bloodGroup = "Blood group is required";
  }
  if (!personalDetails.personalEmail || !emailRegex.test(personalDetails.personalEmail)) {
    errors.personalEmail = "Invalid email format";
  }
  if (!personalDetails.phoneNumber || !phoneRegex.test(personalDetails.phoneNumber)) {
    errors.phoneNumber = "Invalid phone number (10 digits required)";
  }
  if (!personalDetails.maritalStatus?.trim()) {
    errors.maritalStatus = "Marital status is required";
  }
  if (!personalDetails.aadharNumber || !aadharRegex.test(personalDetails.aadharNumber)) {
    errors.aadharNumber = "Aadhar must be 12 digits";
  }
  if (!personalDetails.panNumber || !panRegex.test(personalDetails.panNumber)) {
    errors.panNumber = "PAN format invalid (e.g., ABCDE1234F)";
  }
  if (!personalDetails.currentAddress?.trim()) {
    errors.currentAddress = "Current address is required";
  }
  if (!personalDetails.permanentAddress?.trim()) {
    errors.permanentAddress = "Permanent address is required";
  }

  // **Employment Details Validation**
  if (!employmentDetails.employeeId?.trim()) {
    errors.employeeId = "Employee ID is required";
  }
  if (!employmentDetails.jobTitle?.trim()) {
    errors.jobTitle = "Job title is required";
  }
  if (!employmentDetails.location?.trim()) {
    errors.location = "Location is required";
  }
  if (!employmentDetails.officeEmail || !emailRegex.test(employmentDetails.officeEmail)) {
    errors.officeEmail = "Invalid office email format";
  }
  if (!employmentDetails.dateOfJoining) {
    errors.dateOfJoining = "Date of Joining is required";
  }
  if (!employmentDetails.employmentType?.trim()) {
    errors.employmentType = "Employment type is required";
  }
  if (!employmentDetails.uanNumber || !uanPfEsicRegex.test(employmentDetails.uanNumber)) {
    errors.uanNumber = "UAN must be 12 digits";
  }
  if (!employmentDetails.pfNumber || !uanPfEsicRegex.test(employmentDetails.pfNumber)) {
    errors.pfNumber = "PF number must be 12 digits";
  }
  if (!employmentDetails.esicNumber || !uanPfEsicRegex.test(employmentDetails.esicNumber)) {
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
  if (!bankDetails.accountNumber || !accountNumberRegex.test(bankDetails.accountNumber)) {
    errors.accountNumber = "Account Number must be 8-18 digits";
  }

  return errors;
};






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

  console.log(data);

  try {
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
        current_address: personalDetails.currentAddress || "Not Available",
        permanent_address: personalDetails.permanentAddress || "Not Available",
        city: personalDetails.location || "Unknown",
        nationality: personalDetails.nationality || "Unknown",
        marital_status: personalDetails.maritalStatus || "Unknown",
        blood_group: personalDetails.bloodGroup || "Unknown",
        approval_status: personalDetails.approvalStatus || "APPROVED",
      },
    });

    // Update Employment Details
    await prisma.employment.upsert({
      where: { employee_id: id },
      update: {
        designation: employmentDetails.jobTitle || "Not Assigned",
        department: employmentDetails.department || "General",
        date_of_joining: employmentDetails.dateOfJoining
          ? new Date(employmentDetails.dateOfJoining)
          : new Date(),
        employment_type: employmentDetails.employmentType || "FULL_TIME",
        manager_id:
          employmentDetails.manager_id || employmentDetails.lineManagerId || null,
        work_location: employmentDetails.location || "Head Office",
        status: employmentDetails.status || "ACTIVE",
        base_salary: employmentDetails.base_salary || 30000, // Default salary
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
        designation: employmentDetails.designation || "Not Assigned",
        department: employmentDetails.department || "General",
        date_of_joining: employmentDetails.dateOfJoining
          ? new Date(employmentDetails.dateOfJoining)
          : new Date(),
        employment_type: employmentDetails.employmentType || "FULL_TIME",
        manager_id:
          employmentDetails.manager_id || employmentDetails.lineManager || null,
        work_location: employmentDetails.location || "Head Office",
        status: employmentDetails.status || "ACTIVE",
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
      // First, delete existing bank details for this employee
      await prisma.bank.deleteMany({
        where: { employee_id: id },
      });

      // Insert new bank details
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
    if (Object.keys(emergencyContact).length > 0) {
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

    // Fetch all existing documents of the same types
    const existingDocs = await prisma.document.findMany({
      where: {
        employee_id: id,
        document_type: { in: Newdocuments.map((doc) => doc.documentType) },
      },
    });
    console.log(existingDocs);
    // Delete all existing documents of the same types
    if (existingDocs.length > 0) {
      console.log("Entered");
      await prisma.document.deleteMany({
        where: {
          document_id: { in: existingDocs.map((doc) => doc.document_id) },
        },
      });
    }
    console.log("current.........", Newdocuments);
    // Insert new documents
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

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating employee details:", error);
    throw new Error("Internal server error");
  }
};

exports.updateApprovalStatus = async (id, approvalStatus) => {
  try {
    if (approvalStatus === "REJECTED") {
      // Delete all related entries first
      await prisma.salary.deleteMany({ where: { employee_id: id } });
      await prisma.bank.deleteMany({ where: { employee_id: id } });
      await prisma.emergency.deleteMany({ where: { employee_id: id } });
      await prisma.document.deleteMany({ where: { employee_id: id } });
      await prisma.employment.deleteMany({ where: { employee_id: id } });

      // Finally, delete the employee record
      await prisma.employee.delete({ where: { employee_id: id } });

      return {
        success: true,
        message: "Employee and all related data deleted successfully",
      };
    }

    // If not rejected, just update approval status
    await prisma.employee.update({
      where: { employee_id: id },
      data: { approval_status: approvalStatus },
    });

    await prisma.emergency.updateMany({
      where: { employee_id: id },
      data: { approval_status: approvalStatus },
    });

    await prisma.document.updateMany({
      where: { employee_id: id },
      data: { approval_status: approvalStatus },
    });

    return { success: true, message: "Approval status updated successfully" };
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
