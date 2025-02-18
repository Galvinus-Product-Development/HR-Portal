const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/generateToken");
const { sendEmail } = require("../../utils/sendEmail");
const prisma = require("../../models/prisma/prismaClient");

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    await sendEmail(
      email,
      "Password Reset Request",
      `Click this link to reset your password: ${resetUrl}`
    );

    res.status(200).json({ message: "Reset email sent successfully." });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Complete Password Reset
const completePasswordReset = async (req, res) => {
  const { token, password } = req.body;
  console.log(token,password);
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    console.log(resetToken,resetToken.expiresAt < new Date());

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in completePasswordReset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { requestPasswordReset, completePasswordReset };
