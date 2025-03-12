const express = require('express');
const router = express.Router();
const leaveBalanceController = require('../controllers/leaveBalanceController');

router.get('/', leaveBalanceController.getLeaveBalance);

module.exports = router;
