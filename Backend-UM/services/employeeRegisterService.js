const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

exports.handleEmployeeRegistration = async ({ name, email, password }) => {
  let existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return existingUser.id; // 👈 Return existing user ID
  }

  // Ensure EMPLOYEE role exists
  let employeeRole = await prisma.role.findUnique({ where: { name: "EMPLOYEE" } });

  if (!employeeRole) {
    employeeRole = await prisma.role.create({
      data: {
        name: "EMPLOYEE",
        description: "Employee role with limited access",
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      roleId: employeeRole.id,
    },
  });

  return newUser.id;
};
