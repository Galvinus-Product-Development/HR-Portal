// controllers/authController/deviceController.js

const prisma = require("../models/prisma/prismaClient");

const registerDevice = async (userId, deviceId, userAgent, ipAddress) => {
  try {
    // Check if device already exists
    const existingDevice = await prisma.device.findUnique({
      where: { deviceId: deviceId },
    });

    if (existingDevice) {
      // Update device if it already exists
      await prisma.device.update({
        where: { deviceId: deviceId },
        data: {
          userAgent: userAgent,
          ipAddress: ipAddress,
          updatedAt: new Date(),
        },
      });
    } else {
      // Register new device
      await prisma.device.create({
        data: {
          userId: userId,
          deviceId: deviceId,
          userAgent: userAgent,
          ipAddress: ipAddress,
        },
      });
    }
  } catch (error) {
    console.error("Error registering device:", error);
    throw new Error("Device registration failed");
  }
};

module.exports = { registerDevice };
