const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    // Create roles dynamically
    const roles = [
      { name: "SUPER_ADMIN", description: "Has full access" },
      { name: "ADMIN", description: "Can manage employees" },
      { name: "EMPLOYEE", description: "Regular employee with limited access" },
    ];

    const roleRecords = await Promise.all(
      roles.map((role) =>
        prisma.role.upsert({
          where: { name: role.name },
          update: {},
          create: role,
        })
      )
    );

    console.log("Roles seeded:", roleRecords.map((r) => r.name));

    // Create permissions
    const permissions = [
      { name: "manage_employees", description: "Can add, edit, and delete employees" },
      { name: "view_employee_details", description: "Can view employee profiles" },
      { name: "edit_employee_details", description: "Can edit employee details" },
      { name: "reset_employee_password", description: "Can reset employee passwords" },
    ];

    const permissionRecords = await Promise.all(
      permissions.map((permission) =>
        prisma.permission.upsert({
          where: { name: permission.name },
          update: {},
          create: permission,
        })
      )
    );

    console.log("Permissions seeded:", permissionRecords.map((p) => p.name));

    // Assign permissions to roles dynamically
    const rolePermissions = [
      { role: "ADMIN", permission: "manage_employees" },
      { role: "ADMIN", permission: "view_employee_details" },
      { role: "ADMIN", permission: "edit_employee_details" },
      { role: "ADMIN", permission: "reset_employee_password" },
      { role: "EMPLOYEE", permission: "view_employee_details" },
    ];

    for (const rp of rolePermissions) {
      const role = await prisma.role.findUnique({ where: { name: rp.role } });
      const permission = await prisma.permission.findUnique({ where: { name: rp.permission } });

      if (role && permission) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          update: {},
          create: { roleId: role.id, permissionId: permission.id },
        });
      }
    }

    console.log("Role-Permission mapping completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

const seedSuperAdmin = async () => {
  try {
    console.log("Seeding Super Admin...");

    const passwordHash = await bcrypt.hash("SuperAdmin@123", 10);

    const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });

    if (!superAdminRole) {
      console.error("Super Admin role not found!");
      return;
    }

    // Check if the Super Admin exists
    let superAdmin = await prisma.user.findUnique({
      where: { email: "debswarnadeep85@gmail.com" },
    });

    if (!superAdmin) {
      superAdmin = await prisma.user.create({
        data: {
          name: "Super Admin",
          email: "debswarnadeep85@gmail.com",
          passwordHash,
          roleId: superAdminRole.id, // Assign role dynamically
          status: "active",
        },
      });

      console.log("Super Admin created:", superAdmin.email);
    } else {
      console.log("Super Admin already exists.");
    }
  } catch (error) {
    console.error("Error creating Super Admin:", error);
  }
};

const seedEmployees = async () => {
  try {
    console.log("Seeding Employees...");

    const employeeRole = await prisma.role.findUnique({ where: { name: "EMPLOYEE" } });

    if (!employeeRole) {
      console.error("Employee role not found!");
      return;
    }

    const employees = [
      { name: "John Doe", email: "john.doe@company.com" },
      { name: "Jane Smith", email: "jane.smith@company.com" },
    ];

    for (const emp of employees) {
      const existingEmployee = await prisma.user.findUnique({
        where: { email: emp.email },
      });

      if (!existingEmployee) {
        const passwordHash = await bcrypt.hash("Employee@123", 10);

        await prisma.user.create({
          data: {
            name: emp.name,
            email: emp.email,
            passwordHash,
            roleId: employeeRole.id, // Assign role dynamically
            status: "active",
          },
        });

        console.log(`Employee ${emp.name} added.`);
      }
    }
  } catch (error) {
    console.error("Error seeding Employees:", error);
  }
};

// Execute all functions sequentially
const seed = async () => {
  await seedDatabase();
  await seedSuperAdmin();
  await seedEmployees();
  console.log("Seeding process completed.");
  await prisma.$disconnect();
};

seed();
