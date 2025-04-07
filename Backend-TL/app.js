// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const path = require("path");

// const cors = require("cors");
// const trainerRoutes = require("./routes/trainer.routes");
// const trainingRoutes = require("./routes/training.routes");
// const courseMaterial = require("./routes/courseMaterial.routes");
// const additionalResource = require("./routes/additionalResource.routes");
// const employee = require("./routes/employee.routes");
// const participant = require("./routes/participant.routes");
// const session = require("./routes/session.routes");
// const videoLecture = require("./routes/videoLecture.routes");
// const participantEnroll = require("./routes/participantEnroll.routes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.get("/tl", (req, res) => {
//   res.status(200).json({ status: "ok", message: `Service is healthy` });
// });
// app.use("/tl/additional-resource", additionalResource);
// app.use("/tl/course-material", courseMaterial);
// app.use("/tl/employee", employee);
// app.use("/tl/participant", participant);
// app.use("/tl/session", session);
// app.use("/tl/trainers", trainerRoutes);
// app.use("/tl/trainings", trainingRoutes);
// app.use("/tl/video-Lectures", videoLecture);
// app.use("/tl/enroll", participantEnroll);
// // Add other routes here...


// // Configure storage to keep original file names and extensions
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname); // Extract file extension
//     const name = path.basename(file.originalname, ext); // Extract filename without extension
//     cb(null, `${name}-${Date.now()}${ext}`); // Preserve name + timestamp
//   },
// });

// const upload = multer({ storage });

// app.post(
//   "/tl/upload",
//   upload.fields([
//     { name: "material", maxCount: 10 },
//     { name: "lecture", maxCount: 10 },
//     { name: "resource", maxCount: 10 },
//   ]),
//   (req, res) => {
//     console.log(req.files);
//     res.json({ message: "Files uploaded successfully", files: req.files });
//   }
// );

// const PORT = process.env.PORT || 5004;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const s3 = require("./config/s3Config");
const cors = require("cors");

const trainerRoutes = require("./routes/trainer.routes");
const trainingRoutes = require("./routes/training.routes");
const courseMaterial = require("./routes/courseMaterial.routes");
const additionalResource = require("./routes/additionalResource.routes");
const employee = require("./routes/employee.routes");
const participant = require("./routes/participant.routes");
const session = require("./routes/session.routes");
const videoLecture = require("./routes/videoLecture.routes");
const participantEnroll = require("./routes/participantEnroll.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/tl", (req, res) => {
  res.status(200).json({ status: "ok", message: "Service is healthy" });
});
app.use("/tl/additional-resource", additionalResource);
app.use("/tl/course-material", courseMaterial);
app.use("/tl/employee", employee);
app.use("/tl/participant", participant);
app.use("/tl/session", session);
app.use("/tl/trainers", trainerRoutes);
app.use("/tl/trainings", trainingRoutes);
app.use("/tl/video-Lectures", videoLecture);
app.use("/tl/enroll", participantEnroll);

// Configure multer to use S3 storage
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME, // Ensure this is defined in .env
//     acl: "public-read", // Allow public access (adjust as needed)
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const name = path.basename(file.originalname, ext);
//       cb(null, `uploads/${Date.now()}-${name}${ext}`);
//     },
//   }),
// });

// // Upload endpoint
// app.post(
//   "/tl/upload",
//   upload.fields([
//     { name: "material", maxCount: 10 },
//     { name: "lecture", maxCount: 10 },
//     { name: "resource", maxCount: 10 },
//   ]),
//   (req, res) => {
//     if (!req.files) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     const uploadedFiles = {};
//     for (const field in req.files) {
//       uploadedFiles[field] = req.files[field].map((file) => ({
//         fileName: file.originalname,
//         fileUrl: file.location, // S3 file URL
//       }));
//     }

//     res.json({ message: "Files uploaded successfully", files: uploadedFiles });
//   }
// );

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));