const express = require('express');
const router = express.Router();
const attendanceRequestController = require('../controllers/attendanceRequestController');

// Route to create a new attendance request
router.post('/', attendanceRequestController.createAttendanceRequest);
router.get('/', attendanceRequestController.getAllAttendanceRequests);
// router.get('/:id', attendanceRequestController.getAttendanceRequestById);
router.patch('/:id', attendanceRequestController.updateAttendanceRequest);
router.delete('/:id', attendanceRequestController.deleteAttendanceRequest);

module.exports = router;