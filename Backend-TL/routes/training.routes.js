// const express = require("express");
// const router = express.Router();
// const trainingController = require("../controllers/training.controller");

// const multer = require("multer");

// // Multer storage (files stored in memory as Buffer)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Middleware to handle multiple file fields
// const uploadFields = upload.fields([
//   { name: "materialFiles", maxCount: 10 },
//   { name: "lectureFiles", maxCount: 10 },
//   { name: "resourceFiles", maxCount: 10 },
// ]);


// router.get("/FormattedTrainings", trainingController.getFormattedTrainings);
// router.get(
//   "/FormattedTrainingById/:id",
//   trainingController.getFormattedTrainingById
// );
// router.get("/", trainingController.getAllTrainings);
// router.get("/:id", trainingController.getTrainingById);

// router.post("/", uploadFields, trainingController.createTraining);

// router.put("/:id",uploadFields, trainingController.updateTraining);
// router.delete("/:id", trainingController.deleteTraining);

// module.exports = router;


const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/training.controller");

const multer = require("multer");

// Multer storage (files stored in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle multiple file fields
const uploadFields = upload.fields([
  { name: "materialFiles", maxCount: 10 },
  { name: "lectureFiles", maxCount: 10 },
  { name: "resourceFiles", maxCount: 10 },
]);

// Logging middleware to check incoming files
const logUpload = (req, res, next) => {
  console.log("---- Incoming Request ----");
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body:", req.body);
  console.log("Files:", req.files);
  console.log("--------------------------");
  next();
};

router.get("/FormattedTrainings", trainingController.getFormattedTrainings);
router.get("/FormattedTrainingById/:id", trainingController.getFormattedTrainingById);
router.get("/", trainingController.getAllTrainings);
router.get("/:id", trainingController.getTrainingById);

router.post("/", uploadFields, logUpload, trainingController.createTraining);
router.put("/:id", uploadFields, logUpload, trainingController.updateTraining);
router.delete("/:id", trainingController.deleteTraining);

module.exports = router;
