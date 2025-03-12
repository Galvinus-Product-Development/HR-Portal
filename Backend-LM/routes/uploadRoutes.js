const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure storage for Multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/leave-request-documents/');
	},
	filename: (req, file, cb) => {
		// Generate a unique filename using timestamp and original name
		cb(null, Date.now() + '-' + file.originalname);
	}
});

// Filter allowed file types (PDF, images, DOC, DOCX)
const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		'application/pdf',
		'image/jpeg',
		'image/png',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Unsupported file type'), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}
	const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
	res.status(200).json({ url: fileUrl });
});

module.exports = router;
