const bcrypt = require("bcrypt");
const prisma = require("../models/prisma/prismaClient");
const { sendEmail } = require("../utils/sendEmail");

/**
 * Sends a registration link to the specified email.
 */
const sendRegistrationLink = async (email) => {
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already registered");

  // Generate a unique token
  const token = (await bcrypt.hash(email + Date.now(), 10)).replace(/\//g, "");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  // Store token
  await prisma.passwordResetToken.create({ data: { email, token, expiresAt } });
  console.log(token);
  // Send email with the registration link
  const registrationLink = `http://localhost:5173/complete-registration/${token}`;
  await sendEmail(email, "Complete Your Registration", `Click here to register: ${registrationLink}`);

  return "Registration link sent successfully!";
};

/**
 * Completes the registration using a token.
 */
const completeRegistration = async (token, name, password) => {
    // Validate token
    const tokenRecord = await prisma.passwordResetToken.findUnique({ where: { token } });
    console.log(tokenRecord);
    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
      throw new Error("Invalid or expired token");
    }
  
    // Check if the "ADMIN" role exists, if not, create it
    let employeeRole = await prisma.role.findUnique({ where: { name: "EMPLOYEE" } });
    if (!employeeRole) {
      employeeRole = await prisma.role.create({
        data: {
          name: "EMPLOYEE",
          description: "Employee role with limitted access",
        },
      });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create the new admin user with the found/created role
    await prisma.user.create({
      data: {
        name,
        email: tokenRecord.email,
        passwordHash: hashedPassword,
        roleId: employeeRole.id, // Assign roleId dynamically
      },
    });
  
    // Delete the used token
    await prisma.passwordResetToken.delete({ where: { token } });
  
    return "Registration completed successfully!";
};

const deleteUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                refreshTokens: true,
                devices: true,
                passwordResetTokens: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Delete related records first
        await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
        await prisma.device.deleteMany({ where: { userId: user.id } });
        await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });
        
        // Delete the user
        await prisma.user.delete({ where: { id: user.id } });

        return { message: "User and related data deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};

// const deleteUserByEmail = async (email) => {
//   try {
//       const user = await prisma.user.findUnique({
//           where: { email },
//           include: {
//               refreshTokens: true,
//               devices: true,
//               passwordResetTokens: true,
//           },
//       });

//       if (!user) {
//           throw new Error("User not found");
//       }


//       await prisma.refreshToken.updateMany({
//           where: { userId: user.id },
//           data: { deviceId: null },  
//       });

      
//       await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

      
//       await prisma.device.deleteMany({ where: { userId: user.id } });

      
//       await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });

      
//       await prisma.user.delete({ where: { id: user.id } });

//       return { message: "User and related data deleted successfully" };
//   } catch (error) {
//       throw new Error(error.message);
//   }
// };




module.exports = { sendRegistrationLink, completeRegistration, deleteUserByEmail };
