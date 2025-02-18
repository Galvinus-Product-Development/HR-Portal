const jwt = require("jsonwebtoken");
const prisma = require("../../models/prisma/prismaClient"); // Prisma client initialization
const { generateTokens } = require("../../utils/tokenUtils");

// Function to verify the refresh token and generate new tokens
const handleRefreshToken = async (refreshToken) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

    // Fetch the refresh token from the database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new Error("Invalid or expired refresh token");
    }

    // Check if the refresh token is expired
    if (new Date(storedToken.expiresAt) < new Date()) {
      throw new Error("Refresh token has expired");
    }

    // Fetch the user associated with the refresh token
    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    // Update the stored refresh token in the database
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
      },
    });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error(err.message || "Something went wrong");
  }
};

module.exports = { handleRefreshToken };
