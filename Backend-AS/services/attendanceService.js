const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
exports.markAttendance = async (attendanceData) => {
    let { 
        employeeId, 
        date, 
        punchInTime, 
        punchOutTime, 
        attendanceStatus, 
        punchInMethod, 
        punchOutMethod, 
    } = attendanceData;

    let workingHours = 0;
    let lateComing = 0;
    let overtime = 0;

    // Verify and decode JWT token
    let decoded;
    try {
        decoded = jwt.verify(employeeId, process.env.JWT_SECRET);
    } catch (error) {
        console.log(error);
        return { status: 401, data: { error: "Unauthorized: Invalid token" } };
    }

    employeeId = decoded.userId; // Extract userId from token payload

    if (!employeeId) {
        return {
        status: 401,
        data: { error: "Unauthorized: Invalid user ID in token" },
        };
    }


    if (punchInTime) {
        const punchIn = new Date(punchInTime);

        // Check for late coming (after 10:30 AM IST)
        const lateThreshold = new Date(punchIn);
        lateThreshold.setHours(10, 30, 0, 0); // 10:30 AM

        if (punchIn > lateThreshold) {
            lateComing = Math.floor((punchIn - lateThreshold) / (1000 * 60));
        }

        if (punchOutTime) {
            const punchOut = new Date(punchOutTime);
            
            // Calculate working hours in minutes
            workingHours = Math.floor((punchOut - punchIn) / (1000 * 60));

            // Calculate overtime (if workingHours > 570 minutes)
            if (workingHours > 570) {
                overtime = workingHours - 570;
            }
        }
    }

    const attendance = await prisma.attendance.create({
        data: {
            employeeId,
            date: new Date(date),
            punchInTime: punchInTime ? new Date(punchInTime) : null,
            punchOutTime: punchOutTime ? new Date(punchOutTime) : null,
            attendanceStatus,
            punchInMethod,
            punchOutMethod,
            workingHours,  // Stored in minutes
            lateComing,
            overtime,
            // paidLeave: paidLeave || 0,
            // unpaidLeave: unpaidLeave || 0,
            presentDays:0
        }
    });

    return attendance;
};


exports.updateAttendance = async (id, updateData) => {
    // Handle punch out updates
    if (updateData.punchOutTime && !updateData.workingHours) {
        const attendance = await prisma.attendance.findUnique({
            where: { id }
        });

        if (attendance && attendance.punchInTime) {
            const punchIn = new Date(attendance.punchInTime);
            const punchOut = new Date(updateData.punchOutTime);
            
            // Calculate working hours in minutes
            updateData.workingHours = Math.floor((punchOut - punchIn) / (1000 * 60));
            
            // Check for overtime (after 8:00 PM IST)
            const overtimeThreshold = new Date(punchOut);
            overtimeThreshold.setHours(20, 0, 0, 0); // 8:00 PM
            
            if (punchOut > overtimeThreshold) {
                // Calculate overtime minutes
                updateData.overtime = Math.floor((punchOut - overtimeThreshold) / (1000 * 60));
            }
        }
    }

    return await prisma.attendance.update({
        where: { id },
        data: updateData
    });
};

exports.getAttendance = async (id) => {
	const attendance = await prisma.attendance.findUnique({
        where: { id }
    });
    return attendance;
};

exports.getTodayAttendance = async (employeeId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.attendance.findFirst({
        where: {
            employeeId,
            date: {
                gte: today,
                lt: tomorrow
            }
        }
    });
};

exports.getMonthlySummary = async (monthYear) => {
    const startDate = new Date(`${monthYear}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Move to the first day of next month

    return await prisma.attendance.findMany({
        where: { date: { gte: startDate, lt: endDate } },
    });
};

exports.getEmployeeMonthlySummary = async (employeeId, monthYear) => {
    const startDate = new Date(`${monthYear}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    return await prisma.attendance.findMany({
        where: { 
            employeeId,
            date: { gte: startDate, lt: endDate } 
        }
    });
};