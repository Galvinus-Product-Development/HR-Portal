const express = require('express');
const router = express.Router();
const leaveBalanceController = require('../controllers/leaveBalanceController');

router.get('/', leaveBalanceController.getLeaveBalance);
router.post('/createBalance/:employeeId', leaveBalanceController.createLeaveBalance);

module.exports = router;
