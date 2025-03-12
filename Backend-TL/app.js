require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");

const cors = require("cors");
const trainerRoutes = require("./routes/trainer.routes");
const trainingRoutes = require("./routes/training.routes");
const additionalResource = require("./routes/additionalResource.routes");
const courseMaterial = require("./routes/courseMaterial.routes");
const employee = require("./routes/employee.routes");
const participant = require("./routes/participant.routes");
const session = require("./routes/session.routes");
const videoLecture = require("./routes/videoLecture.routes");
const participantEnroll = require("./routes/participantEnroll.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/additional-resource", additionalResource);
app.use("/course-material", courseMaterial);
app.use("/employee", employee);
app.use("/participant", participant);
app.use("/session", session);
app.use("/trainers", trainerRoutes);
app.use("/trainings", trainingRoutes);
app.use("/video-Lectures", videoLecture);
app.use("/enroll", participantEnroll);
// Add other routes here...


// Configure storage to keep original file names and extensions
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension
    const name = path.basename(file.originalname, ext); // Extract filename without extension
    cb(null, `${name}-${Date.now()}${ext}`); // Preserve name + timestamp
  },
});

const upload = multer({ storage });

app.post(
  "/upload",
  upload.fields([
    { name: "material", maxCount: 10 },
    { name: "lecture", maxCount: 10 },
    { name: "resource", maxCount: 10 },
  ]),
  (req, res) => {
    console.log(req.files);
    res.json({ message: "Files uploaded successfully", files: req.files });
  }
);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
