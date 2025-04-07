const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1"
});

/**
 * Deletes an existing profile picture from S3
 */
const deleteFromS3 = async (imageUrl) => {
  if (!imageUrl) return;

  const key = imageUrl.split(".com/")[1]; // Extracting file key from URL
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error("Failed to delete old image from S3:", error.message);
  }
};

/**
 * Uploads a new profile picture to S3
 */
const uploadToS3 = async (fileBuffer, fileName, fileType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `profiles/${Date.now()}_${fileName}`,
    Body: fileBuffer,
    ContentType: fileType,
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location; // Return public image URL
  } catch (error) {
    throw new Error("Failed to upload image to S3: " + error.message);
  }
};

module.exports = { uploadToS3, deleteFromS3 };
