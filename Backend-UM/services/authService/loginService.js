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

