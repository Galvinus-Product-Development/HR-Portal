// leavePolicyRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure Multer storage and file filter for PDF uploads.
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/leave-policies');
	},
	filename: function (req, file, cb) {
		// Use a unique name to prevent filename collisions.
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'application/pdf') {
		cb(null, true);
	} else {
		cb(new Error('Only PDF files are allowed'), false);
	}
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Import controller functions.
const leavePolicyController = require('../controllers/leavePolicyController');

router.post('/upload', upload.single('policyFile'), leavePolicyController.createPolicy);
router.get('/', leavePolicyController.getAllPolicies);
router.get('/:id', leavePolicyController.getPolicyById);
router.delete('/:id', leavePolicyController.deletePolicy);

// Route for downloading a policy document.
// This route directly uses Prisma to fetch the file path and then triggers the download.
router.get('/:id/download', async (req, res) => {
	try {
		const { PrismaClient } = require('@prisma/client');
		const prisma = new PrismaClient();
		const { id } = req.params;
		const policy = await prisma.leavePolicy.findUnique({ where: { id } });
		if (policy && policy.documentUrl) {
			res.download(policy.documentUrl);
		} else {
			res.status(404).json({ error: 'File not found' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
