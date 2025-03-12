

const attendanceService = require('../services/attendanceService');
const jwt = require("jsonwebtoken");
exports.markAttendance = async (req, res) => {
	try {
		const data = await attendanceService.markAttendance(req.body);
        res.status(201).json(data);
	} catch (error) {
        console.log(error);
		res.status(500).json({ error: error.message });
	}
};

exports.getAttendance = async (req, res) => {
	try {
		const data = await attendanceService.getAttendance(req.params.id);
		if (data && data.workingHours) {
            // Convert workingHours to a human-readable format in the response
            const hours = Math.floor(data.workingHours / 60);
            const minutes = data.workingHours % 60;
            data.formattedWorkingHours = `${hours}h ${minutes}m`;
        }
        if (data && data.overtime) {
            // Convert overtime to a human-readable format
            const overtimeHours = Math.floor(data.overtime / 60);
            const overtimeMinutes = data.overtime % 60;
            data.formattedOvertime = `${overtimeHours}h ${overtimeMinutes}m`;
        }
        res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getTodayAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        // Verify and decode JWT token
        let decoded;
        try {
            decoded = jwt.verify(employeeId, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error);
            return { status: 401, data: { error: "Unauthorized: Invalid token" } };
        }
    
        const userId = decoded.userId; // Extract userId from token payload
    
        if (!userId) {
            return {
            status: 401,
            data: { error: "Unauthorized: Invalid user ID in token" },
            };
        }

        const data = await attendanceService.getTodayAttendance(userId);
        if (data && data.workingHours) {
            // Convert workingHours to a human-readable format in the response
            const hours = Math.floor(data.workingHours / 60);
            const minutes = data.workingHours % 60;
            data.formattedWorkingHours = `${hours}h ${minutes}m`;
        }
        if (data && data.overtime) {
            // Convert overtime to a human-readable format
            const overtimeHours = Math.floor(data.overtime / 60);
            const overtimeMinutes = data.overtime % 60;
            data.formattedOvertime = `${overtimeHours}h ${overtimeMinutes}m`;
        }
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateTodayAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        console.log("aaaaaaaaaaaaaaaa",employeeId);
        // Verify and decode JWT token
        let decoded;
        try {
            decoded = jwt.verify(employeeId, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error);
            return { status: 401, data: { error: "Unauthorized: Invalid token" } };
        }
    
        const userId = decoded.userId; // Extract userId from token payload
    
        if (!userId) {
            return {
            status: 401,
            data: { error: "Unauthorized: Invalid user ID in token" },
            };
        }


        const todayAttendance = await attendanceService.getTodayAttendance(userId);
        
        if (!todayAttendance) {
            return res.status(404).json({ error: "No attendance record found for today" });
        }
        
        const data = await attendanceService.updateAttendance(todayAttendance.id, req.body);
        
        if (data && data.workingHours) {
            // Convert workingHours to a human-readable format in the response
            const hours = Math.floor(data.workingHours / 60);
            const minutes = data.workingHours % 60;
            data.formattedWorkingHours = `${hours}h ${minutes}m`;
        }
        if (data && data.overtime) {
            // Convert overtime to a human-readable format
            const overtimeHours = Math.floor(data.overtime / 60);
            const overtimeMinutes = data.overtime % 60;
            data.formattedOvertime = `${overtimeHours}h ${overtimeMinutes}m`;
        }
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMonthlySummary = async (req, res) => {
	try {
		const { monthYear } = req.params;
		const records = await attendanceService.getMonthlySummary(monthYear);
		
		// Format working hours and overtime for all records in the response
		const formattedRecords = records.map(record => {
            if (record.workingHours) {
                const hours = Math.floor(record.workingHours / 60);
                const minutes = record.workingHours % 60;
                record.formattedWorkingHours = `${hours}h ${minutes}m`;
            }
            if (record.overtime) {
                const overtimeHours = Math.floor(record.overtime / 60);
                const overtimeMinutes = record.overtime % 60;
                record.formattedOvertime = `${overtimeHours}h ${overtimeMinutes}m`;
            }
            return record;
        });
		
		res.status(200).json(formattedRecords);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getEmployeeMonthlySummary = async (req, res) => {
    try {
        const { employeeId, monthYear } = req.params;

        // Verify and decode JWT token
        let decoded;
        try {
            decoded = jwt.verify(employeeId, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error);
            return { status: 401, data: { error: "Unauthorized: Invalid token" } };
        }
    
        const userId = decoded.userId; // Extract userId from token payload
    
        if (!userId) {
            return {
            status: 401,
            data: { error: "Unauthorized: Invalid user ID in token" },
            };
        }
        const records = await attendanceService.getEmployeeMonthlySummary(userId, monthYear);

        const formattedRecords = records.map(record => {
            if (record.workingHours) {
                const hours = Math.floor(record.workingHours / 60);
                const minutes = record.workingHours % 60;
                record.formattedWorkingHours = `${hours}h ${minutes}m`;
            }
            if (record.overtime) {
                const overtimeHours = Math.floor(record.overtime / 60);
                const overtimeMinutes = record.overtime % 60;
                record.formattedOvertime = `${overtimeHours}h ${overtimeMinutes}m`;
            }
            return record;
        });

        res.status(200).json(formattedRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};