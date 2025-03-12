



const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Starting Database Seeding...");

    // 1️⃣ Seeding Employees
    console.log("👷 Creating Employees...");
    const employees = [];
    for (let i = 0; i < 10; i++) {
      const employee = await prisma.employee.create({
        data: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          date_of_birth: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
          gender: faker.helpers.arrayElement(["MALE", "FEMALE", "OTHER"]),
          phone_number: faker.phone.number(),
          alternate_phone_number: faker.helpers.maybe(() => faker.phone.number()),
          email: faker.internet.email(),
          current_address: faker.location.streetAddress(),
          permanent_address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          postal_code: faker.location.zipCode(),
          nationality: faker.location.country(),
          marital_status: faker.helpers.arrayElement(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
          blood_group: faker.helpers.maybe(() => faker.helpers.arrayElement(["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"])),
          profile_pic_url: faker.image.avatar(),
          approval_status: "PENDING",
        },
      });
      employees.push(employee);
    }
    console.log(`✅ Created ${employees.length} Employees`);

    // 2️⃣ Seeding Employment Records
    console.log("🏢 Creating Employment Records...");
    for (const employee of employees) {
      await prisma.employment.create({
        data: {
          employee_id: employee.employee_id,
          designation: faker.person.jobTitle(),
          department: faker.commerce.department(),
          date_of_joining: faker.date.past({ years: 5 }),
          employment_type: faker.helpers.arrayElement(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]),
          manager_id: faker.helpers.maybe(() => faker.string.uuid()),
          work_location: faker.location.city(),
          status: faker.helpers.arrayElement(["ACTIVE", "TERMINATED", "RESIGNED", "RETIRED"]),
          base_salary: faker.number.float({ min: 50000, max: 150000, fractionDigits: 2 }).toFixed(2),
          stock_bonus: faker.number.float({ min: 5000, max: 20000, fractionDigits: 2 }).toFixed(2),
          termination_date: faker.helpers.maybe(() => faker.date.past()),
          official_email: faker.internet.email(),
        },
      });
    }
    console.log("✅ Employment Records Created");

    // 3️⃣ Seeding Bank Records
    console.log("🏦 Creating Bank Accounts...");
    for (const employee of employees) {
      await prisma.bank.create({
        data: {
          employee_id: employee.employee_id,
          bank_name: faker.company.name(),
          account_number: faker.finance.accountNumber(),
          ifsc_code: faker.finance.bic(),
          branch_name: faker.location.city(),
          account_type: faker.helpers.arrayElement(["SAVINGS", "CURRENT"]),
          account_holder_name: `${employee.first_name} ${employee.last_name}`,
        },
      });
    }
    console.log("✅ Bank Accounts Created");

    // 4️⃣ Seeding Emergency Contacts
    console.log("📞 Creating Emergency Contacts...");
    for (const employee of employees) {
      await prisma.emergency.create({
        data: {
          employee_id: employee.employee_id,
          contact_name: faker.person.fullName(),
          relationship: faker.helpers.arrayElement(["Father", "Mother", "Spouse", "Sibling", "Friend"]),
          contact_phone: faker.phone.number(),
          contact_email: faker.internet.email(),
          approval_status: "PENDING",
        },
      });
    }
    console.log("✅ Emergency Contacts Created");

    // 5️⃣ Seeding Documents
    console.log("📜 Creating Documents...");
    for (const employee of employees) {
      await prisma.document.create({
        data: {
          employee_id: employee.employee_id,
          document_type: faker.helpers.arrayElement(["PASSPORT", "NATIONAL_ID", "DRIVER_LICENSE", "AADHAAR", "PAN"]),
          document_number: faker.string.uuid(),
          issue_date: faker.date.past({ years: 10 }),
          expiry_date: faker.helpers.maybe(() => faker.date.future({ years: 10 })),
          document_path: faker.internet.url(),
          approval_status: "PENDING",
        },
      });
    }
    console.log("✅ Documents Created");

    // 6️⃣ Seeding Salaries
    console.log("💰 Creating Salary Records...");
    for (const employee of employees) {
      const bank = await prisma.bank.findFirst({
        where: { employee_id: employee.employee_id },
      });

      if (!bank) {
        console.warn(`⚠️ No bank record found for employee ${employee.employee_id}, skipping salary creation.`);
        continue;
      }

      await prisma.salary.create({
        data: {
          employee_id: employee.employee_id,
          salary_month: faker.date.past(),
          basic_salary: faker.number.float({ min: 50000, max: 150000, fractionDigits: 2 }).toFixed(2),
          allowances: faker.number.float({ min: 5000, max: 20000, fractionDigits: 2 }).toFixed(2),
          deductions: faker.number.float({ min: 1000, max: 5000, fractionDigits: 2 }).toFixed(2),
          net_salary: faker.number.float({ min: 45000, max: 140000, fractionDigits: 2 }).toFixed(2),
          payment_date: faker.date.recent(),
          payment_status: faker.helpers.arrayElement(["PENDING", "COMPLETED", "FAILED"]),
          bank_id: bank.bank_id,
        },
      });
    }
    console.log("✅ Salaries Created");

    // 7️⃣ Seeding Certifications
    console.log("🎓 Creating Certifications...");
    for (const employee of employees) {
      const numOfCertifications = faker.number.int({ min: 1, max: 3 }); // Each employee has 1 to 3 certifications

      for (let i = 0; i < numOfCertifications; i++) {
        await prisma.certification.create({
          data: {
            employee_id: employee.employee_id,
            certificate_name: faker.helpers.arrayElement([
              "AWS Certified Solutions Architect",
              "Google Cloud Professional Engineer",
              "Microsoft Azure Administrator",
              "Certified Scrum Master",
              "PMP Certification",
              "Cisco CCNA",
              "Oracle Java Certification",
            ]),
            issuing_authority: faker.company.name(),
            issue_date: faker.date.past({ years: 5 }),
            expiry_date: faker.helpers.maybe(() => faker.date.future({ years: 5 })),
            certificate_path: faker.internet.url(),
            badge_visibility: faker.datatype.boolean(),
            approval_status: faker.helpers.arrayElement(["PENDING", "APPROVED", "REJECTED"]),
          },
        });
      }
    }
    console.log("✅ Certifications Created");

    console.log("🎉 Seeding Completed Successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// main();
async function deleteEverything() {
  try {
    console.log("🚨 Deleting all records...");

    // Delete in reverse order of dependencies to prevent foreign key constraint errors
    await prisma.certification.deleteMany();
    await prisma.salary.deleteMany();
    await prisma.document.deleteMany();
    await prisma.emergency.deleteMany();
    await prisma.bank.deleteMany();
    await prisma.employment.deleteMany();
    await prisma.employee.deleteMany();

    console.log("✅ All records deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting records:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
deleteEverything();


