const express = require('express');
const upload = require('../services/certificationService');
const { uploadCertificate,getCertificationsByEmployeeId ,getCertifications} = require('../controllers/certificationController');

// router.get('/certifications/:id', getCertificationById);
const router = express.Router();

// Upload certification file
router.post('/upload', upload.single('certificate_file'), uploadCertificate);
router.get('/:employeeId',getCertificationsByEmployeeId);
router.get('/',getCertifications);

module.exports = router;
