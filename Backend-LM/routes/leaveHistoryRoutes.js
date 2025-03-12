const express = require('express');
const router = express.Router();
const leaveHistoryController = require('../controllers/leaveHistoryController');

// Endpoint to fetch leave history using query parameters (year, month, status)
router.get('/', leaveHistoryController.getAllLeaveHistory);

// Existing endpoints
router.get('/employee/:employeeId/:year/:month', leaveHistoryController.getEmployeeLeaveHistoryForMonth);
router.get('/:id', leaveHistoryController.getLeaveHistoryById);
router.post('/', leaveHistoryController.createLeaveHistory);
router.put('/:id', leaveHistoryController.updateLeaveHistory);
router.delete('/:id', leaveHistoryController.deleteLeaveHistory);

module.exports = router;
