const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leaveRequestController');

router.post('/', leaveRequestController.createLeaveRequest);

router.patch('/cancel/:id', leaveRequestController.cancelLeaveRequest);
router.get('/on-leave-today', leaveRequestController.getOnleaveToday);
router.get('/pending/:id', leaveRequestController.getPendingLeaveRequests);
router.get('/', leaveRequestController.getAllLeaveRequests);
router.get('/admin', leaveRequestController.getAllLeaveRequestsForAdmin);

router.patch('/request-approve/:id', leaveRequestController.approveEditedRequest);
router.get('/:id', leaveRequestController.getLeaveRequestById);
router.put('/:id', leaveRequestController.updateLeaveRequest);
router.patch('/:id', leaveRequestController.editLeaveRequest);
router.delete('/:id', leaveRequestController.deleteLeaveRequest);

module.exports = router;
