const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markAttendance);
router.post('/manual', attendanceController.manuallyMarkAttendance);			// ------------ CHANGED HERE --------------
router.get('/present-today', attendanceController.todayAttendanceCount);
router.get('/', attendanceController.getAllAttendance);
router.get("/uncheckedOut", attendanceController.getUncheckedOutEmployees);

router.get('/:employeeId', attendanceController.getAttendanceById);
router.get('/:employeeId/today', attendanceController.getTodayAttendance);
router.put('/:employeeId', attendanceController.updateAttendance);
router.delete('/', attendanceController.deleteAttendance);

module.exports = router;