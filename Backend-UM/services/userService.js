const { PrismaClient } = require("@prisma/client");
const { uploadToS3, deleteFromS3 } = require("./s3Service");

const prisma = new PrismaClient();

const updateProfilePicture = async (userId, file) => {
  if (!file) throw new Error("No file provided");

  // Fetch existing user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profilePicture: true },
  });

  if (!user) throw new Error("User not found");

  // Delete old profile picture if exists
  if (user.profilePicture) {
    await deleteFromS3(user.profilePicture);
  }

  // Upload new profile picture
  const imageUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);

  // Update user profile with new image URL
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profilePicture: imageUrl },
  });

  return updatedUser;
};



const getProfilePicture = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profilePicture: true },
  });

  if (!user) throw new Error("User not found");
  return user.profilePicture || null; // Return null if no profile picture exists
};

module.exports = { getProfilePicture ,updateProfilePicture};

