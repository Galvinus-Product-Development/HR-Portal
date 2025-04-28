const attendanceRequestService = require('../services/attendanceRequestService');

exports.createAttendanceRequest = async (req, res) => {
	try {
		const data = await attendanceRequestService.createAttendanceRequest(req.body);	
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.getAllAttendanceRequests = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const data = await attendanceRequestService.getAllAttendanceRequests(employeeId);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// exports.getAttendanceRequestById = async (req, res) => {
// 	try {
// 		const { employeeId } = req.params;
// 		const { id } = req.query;
// 		const data = await attendanceRequestService.getAttendanceRequestById(employeeId, id);
// 		res.status(200).json(data);
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// }

exports.updateAttendanceRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await attendanceRequestService.updateAttendanceRequest(id, req.body);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}

exports.deleteAttendanceRequest = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { id } = req.query;
		const data = await attendanceRequestService.deleteAttendanceRequest(employeeId, id);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}