const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      // id: `GAL${emp.employee_id.slice(0, 4).toUpperCase()}`, 
      id: `${emp.employee_id}`,
      name: `${emp.first_name} ${emp.last_name}`,
      email: emp.email,
      phone: emp.phone_number,
      department: emp.employment?.department || "N/A",
      designation: emp.employment?.designation || "N/A",
      location: emp.employment?.work_location || "N/A",
      joinDate: emp.employment?.date_of_joining.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      avatar: emp.profile_pic_url,
      status: emp.employment?.status || "N/A",
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
};



exports.fetchEmployeeDetailsById = async (employeeId) => {
    return await prisma.employee.findUnique({
        where: { employee_id: employeeId },
        include: {
            employment: true,
            bankAccounts: true,
            emergencyContacts: true,
            documents: true
        }
    }).then((employee) => {
        if (!employee) return null;

        return {
            id: employee.employee_id,
            name: `${employee.first_name} ${employee.last_name}`,
            personalDetails: {
                gender: employee.gender,
                location: employee.city,
                dateOfBirth: employee.date_of_birth.toISOString().split("T")[0],
                phoneNumber: employee.phone_number,
                personalEmail: employee.email,
                maritalStatus: employee.marital_status,
                currentAddress: `${employee.address}, ${employee.city}, ${employee.state}, ${employee.country} - ${employee.postal_code}`,
                nationality: employee.nationality
            },
            employmentDetails: {
                employeeId: employee.employee_id,
                jobTitle: employee.employment?.designation,
                department: employee.employment?.department,
                dateOfJoining: employee.employment?.date_of_joining.toISOString().split("T")[0],
                employmentType: employee.employment?.employment_type,
                location: employee.employment?.work_location,
                status: employee.employment?.status
            },
            bankDetails: employee.bankAccounts.length > 0 ? {
                bankName: employee.bankAccounts[0].bank_name,
                accountNumber: `****${employee.bankAccounts[0].account_number.slice(-4)}`,
                ifscCode: employee.bankAccounts[0].ifsc_code,
                accountType: employee.bankAccounts[0].account_type
            } : null,
            emergencyContact: employee.emergencyContacts.length > 0 ? {
                name: employee.emergencyContacts[0].contact_name,
                phoneNumber: employee.emergencyContacts[0].contact_phone,
                relationship: employee.emergencyContacts[0].relationship
            } : null,
            avatar: employee.profile_pic_url,
            status: employee.employment?.status
        };
    }).catch((error) => {
        console.error("Database error:", error);
        return null;
    });
};
