const express = require('express');
const router = express.Router();
const monthlyAttendanceController = require('../controllers/monthlyAttendanceController');

router.get('/', monthlyAttendanceController.getAllMonthlyAttendance);
router.get('/:employeeId', monthlyAttendanceController.getMonthlyAttendanceById);
router.post('/:employeeId', monthlyAttendanceController.addMonthlyAttendance);
router.put('/:employeeId', monthlyAttendanceController.updateMonthlyAttendance);
router.patch('/:employeeId', monthlyAttendanceController.updateMonthlyAbsentDays);
router.delete('/:id', monthlyAttendanceController.deleteMonthlyAttendance);

module.exports = router;