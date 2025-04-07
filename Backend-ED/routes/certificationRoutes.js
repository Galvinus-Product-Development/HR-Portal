const express = require('express');
const { uploadCertificate, getCertificationsByEmployeeId, getCertifications } = require('../controllers/certificationController');

const router = express.Router();

const multer = require("multer");

// Multer storage (files stored in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle a single file upload (for the certificate file)
const uploadSingle = upload.single('certificate_file');  // Handle only the "certificate_file" field

// Logging middleware to check incoming files
const logUpload = (req, res, next) => {
  console.log("---- Incoming Request ----");
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body:", req.body);
  console.log("Files:", req.file); // Since only one file is uploaded, we use req.file instead of req.files
  console.log("--------------------------");
  next();
};

// Upload certification file
router.post('/upload', uploadSingle, logUpload, uploadCertificate);
router.get('/:employeeId', getCertificationsByEmployeeId);
router.get('/', getCertifications);

module.exports = router;
