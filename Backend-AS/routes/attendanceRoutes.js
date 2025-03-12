const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markAttendance);
router.get('/:id', attendanceController.getAttendance);
router.get('/employee/:employeeId/today', attendanceController.getTodayAttendance);
router.put('/employee/:employeeId/today', attendanceController.updateTodayAttendance);
router.get('/monthly/:monthYear', attendanceController.getMonthlySummary);
router.get('/employee/:employeeId/monthly/:monthYear', attendanceController.getEmployeeMonthlySummary);

module.exports = router;