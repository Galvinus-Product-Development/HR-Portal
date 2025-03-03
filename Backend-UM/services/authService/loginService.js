// const bcrypt = require('bcryptjs');
// const prisma = require('../../models/prisma/prismaClient'); // Prisma client initialization
// const { generateTokens } = require('../../utils/tokenUtils');
// const jwt = require('jsonwebtoken');
// // Service to handle user login
// const loginService = async (email, password, deviceId, userAgent, ipAddress) => {
//   // Fetch the user from the database
//   const user = await prisma.user.findUnique({
//     where: { email },
//     include: { role: true },
//   });
//   if (!user) {
//     throw new Error('User not found');
//   }

//   // Compare the provided password with the stored hash
//   console.log(user);
//   let isPasswordValid;
//   if (user.passwordHash) isPasswordValid = await bcrypt.compare(password, user.passwordHash);

//   if (!isPasswordValid) {
//     throw new Error('Invalid email or password');
//   }
//   const roleName = user.role?.name || 'EMPLOYEE';
//   // Generate access and refresh tokens
//   const { accessToken, refreshToken } = generateTokens(user.id,roleName);

//   // Store or update device information in the `Device` table
//   let device = await prisma.device.findUnique({
//     where: { deviceId }, // Check if the device already exists
//   });

//   if (!device) {
//     // If the device doesn't exist, create a new one
//     device = await prisma.device.create({
//       data: {
//         deviceId,
//         userId: user.id,
//         userAgent,
//         ipAddress,
//       },
//     });
//   } else {
//     // Optionally, update device info (e.g., last activity)
//     device = await prisma.device.update({
//       where: { deviceId },
//       data: {
//         userAgent,  // Update the userAgent if needed
//         ipAddress,  // Update the IP address if needed
//       },
//     });
//   }

//   // Store the refresh token in the `RefreshToken` table with the device info
//   await prisma.refreshToken.create({
//     data: {
//       token: refreshToken, // You may hash this before storing for added security
//       userId: user.id,
//       deviceId: device.id, // Link the refresh token to the device
//       expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
//     },
//   });
//   const signedUserId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });
//   const userId=user.id
//   return { accessToken, refreshToken, device,roleName ,signedUserId,userId}; 
// };

// module.exports = { loginService };




const bcrypt = require('bcryptjs');
const prisma = require('../../models/prisma/prismaClient');
const { generateTokens } = require('../../utils/tokenUtils');
const jwt = require('jsonwebtoken');

const loginService = async (email, password, deviceId, userAgent, ipAddress) => {
  // Fetch the user along with role and permissions
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Compare the provided password with the stored hash
  let isPasswordValid = user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const roleName = user.role?.name || 'EMPLOYEE';

  // Extract all permission names associated with the role
  const permissions = user.role?.rolePermissions.map((rp) => rp.permission.name) || [];

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = generateTokens(user.id, roleName, permissions);

  // Store or update device information
  let device = await prisma.device.findUnique({ where: { deviceId } });
  if (!device) {
    device = await prisma.device.create({
      data: { deviceId, userId: user.id, userAgent, ipAddress },
    });
  } else {
    device = await prisma.device.update({
      where: { deviceId },
      data: { userAgent, ipAddress },
    });
  }

  // Store the refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      deviceId: device.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const signedUserId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  return { accessToken, refreshToken, device, roleName, signedUserId, userId: user.id };
};

module.exports = { loginService };

