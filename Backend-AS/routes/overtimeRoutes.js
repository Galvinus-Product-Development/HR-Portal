const express = require('express');
const router = express.Router();
const overtimeControllers=require('../controllers/overtimeController.js')

router.post('/:employeeId',overtimeControllers.addOvertime)
router.get('/getOvertime',overtimeControllers.getOvertime)
router.get('/getUnclaimedOvertime/:employeeId',overtimeControllers.unclaimedOvertime)
router.get('/getOvertimeById/:employeeId',overtimeControllers.getOvertimeById)
router.patch('/updateStatus/:id',overtimeControllers.updateOvertime)
router.patch('/claimOvertime/:id',overtimeControllers.claimOvertime)
router.get('/fetchAndUpdateOvertime/:employeeId',overtimeControllers.fetchAndUpdateOvertime)




module.exports = router;
