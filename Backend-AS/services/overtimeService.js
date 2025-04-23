const { PrismaClient, OvertimeStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");


exports.createOvertime = async ({
  employeeId,
  date,
  startTime,
  endTime,
  reason,
}) => {
  // const start = new Date(startTime);
  // const end = new Date(endTime);
  const now = new Date();

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  console.log(`this is start time ${start}, and this is end time ${end}`);

  const durationInMs = end - start;
  if (durationInMs <= 0) {
    throw new Error("End time must be after start time.");
  }

  const hours = Math.floor(durationInMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));

  const existing = await prisma.overtime.findFirst({
    where: {
      employeeId,
      date: new Date(date),
      OR: [
        {
          startTime: {
            lt: new Date(end),
          },
          endTime: {
            gt: new Date(start),
          },
        },
      ],
    },
  });

  if (existing) {
    throw new Error(
      "Overlapping overtime request already exists for this employee during the selected time."
    );
  }

  const overtime = await prisma.overtime.create({
    data: {
      employeeId,
      appliedOn: now,
      date: new Date(date),
      startTime: start,
      endTime: end,
      reason,
      overtimeStatus: OvertimeStatus.REQUESTED, // defaulting to REQUESTED,
      duration: durationInMs,
    },
  });

  try {
    const employeeResponse = await axios.get(
      `${process.env.EMPLOYEE_SERVICE_URLL}/${employeeId}`
    );
    const employee = employeeResponse.data;

    const lineManagerUserId = employee?.employmentDetails?.lineManagerId;

    if (!lineManagerUserId) {
      console.warn("Line manager not found for employee:", employeeId);
    }

    await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
      userIds: [lineManagerUserId],
      title: "New Overtime Request Submitted",
      message: `Employee ${employee?.personalDetails?.name} has submitted an overtime request.`,
      priority: "NORMAL",
      redirectUrl: `${process.env.APP_URL}/employees/`,
      recipientType: "ADMIN",
    });
    console.log("Notification sent successfully!!!");
  } catch (e) {
    console.log("error in the notification", e);
    throw new Error(e);
  }

  return { overtime, duration: { hours, minutes } };
};

exports.getOvertimeById = async (employeeId) => {
  // return await prisma.overtime.findMany({
  //   where: { employeeId },
  //   include: { employee: true }, // includes employee details if needed
  //   orderBy: { date: "desc" },
  // });

  const overtimeRecords = await prisma.overtime.findMany({
    where: { employeeId },
    orderBy: { date: "desc" },
  });

  if (overtimeRecords.length === 0) return [];

  const employeeServiceURL = `${process.env.EMPLOYEE_SERVICE_URLL}/${employeeId}`; // e.g., http://employee-service/api/employees

  // Fetch all employees
  const { data: employees } = await axios.get(employeeServiceURL);

  console.log("This is overtime records by Id :-", employees);

  // Create a map of employees by ID
  // const employeeMap = new Map(employees.data.map(emp => [emp.id, emp]));

  // Attach employee data to each overtime record
  const combinedData = overtimeRecords.map((record) => ({
    ...record,
    employee: employees,
  }));

  return combinedData;
};

exports.getOvertime = async () => {
  const overtimeRecords = await prisma.overtime.findMany({
    orderBy: { date: "desc" },
  });

  if (overtimeRecords.length === 0) return [];

  const employeeServiceURL = process.env.EMPLOYEE_SERVICE_URL; // e.g., http://employee-service/api/employees

  // Fetch all employees
  const { data: employees } = await axios.get(employeeServiceURL);

  console.log(employees);

  // Create a map of employees by ID
  const employeeMap = new Map(employees.data.map((emp) => [emp.id, emp]));

  // Attach employee data to each overtime record
  const combinedData = overtimeRecords.map((record) => ({
    ...record,
    employee: employeeMap.get(record.employeeId) || null,
  }));

  return combinedData;
};




exports.updateOvertimeStatus = async (id, overtimeStatus) => {
  const existingStatus = await prisma.overtime.findUnique({
    where: { id },
  });

  if (!existingStatus) {
    throw new Error("Overtime record not found.");
  }

  let updateOvertimeStatus;

  if (existingStatus.overtimeStatus === "REQUESTED") {
    updateOvertimeStatus = overtimeStatus === "approved"
      ? "REQUESTACCEPTED"
      : "REQUESTREJECTED";

  } else if (existingStatus.overtimeStatus === "CLAIMOVERTIMEREQUESTEED") {
    if (overtimeStatus === "approved") {
      updateOvertimeStatus = "OVERTIMEACCEPTED";

      const dateOnly = new Date(existingStatus.startTime);
      dateOnly.setHours(0, 0, 0, 0);

      // Check if attendance already exists
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          employeeId: existingStatus.employeeId,
          date: {
            gte: dateOnly,
            lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      console.log("This is existing attendance:-..................",existingAttendance);

      if (existingAttendance) {
        // Update existing record
        const val=await prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: {
            overtime:  existingStatus.duration+existingAttendance.overtime,
          },
        });
        console.log("This is val:----------",val);
      } else {
        // Create new attendance record
        await prisma.attendance.create({
          data: {
            employeeId: existingStatus.employeeId,
            date: dateOnly,
            attendanceStatus: "null",
            overtime: existingStatus.duration,
          },
        });
      }

    } else {
      updateOvertimeStatus = "OVERTIMEREJECTED";
    }
  }

  const updatedOvertime = await prisma.overtime.update({
    where: { id },
    data: { overtimeStatus: updateOvertimeStatus },
  });

  return updatedOvertime;
};


exports.getUnclaimedOvertime = async (employeeId) => {
  const now = new Date();
  console.log("Now:", now.toISOString());

  return await prisma.overtime.findMany({
    where: {
      employeeId,
      overtimeStatus: OvertimeStatus.REQUESTACCEPTED,
      endTime: {
        lt: now,
      },
    },
    orderBy: {
      endTime: "desc",
    },
  });
};

exports.claimOvertime = async (id, claimedDurationMs) => {
  try {
    console.log("I am here with the id:", id);
    const existingOvertime = await prisma.overtime.findUnique({
      where: { id },
    });
    console.log(claimedDurationMs, "claimedDurationMs");
    if (!existingOvertime) {
      throw new Error("Overtime data not found.");
    }
    console.log("existingOvertime", existingOvertime);

    const startTime = new Date(existingOvertime.startTime);
    const originalEndTime = new Date(existingOvertime.endTime);
    const originalDurationMs = existingOvertime.duration; // already in ms

    let updatedEndTime = originalEndTime;
    let finalDuration = originalDurationMs;

    console.log(finalDuration);

    // If claimed duration is less, update the end time and duration
    if (claimedDurationMs < originalDurationMs) {
      updatedEndTime = new Date(startTime.getTime() + claimedDurationMs);
      finalDuration = claimedDurationMs;
    }

    const updatedOvertime = await prisma.overtime.update({
      where: { id },
      data: {
        endTime: updatedEndTime,
        duration: finalDuration,
        overtimeStatus: OvertimeStatus.CLAIMOVERTIMEREQUESTEED,
      },
    });

    return updatedOvertime;
  } catch (error) {
    throw error;
  }
};

// exports.convertOvertimeToLeave = async (employeeId) => {
//   try {
//     const attendanceRecords = await prisma.attendance.findMany({
//       where: {
//         employeeId,
//         overtime: {
//           gt: 0,
//         },
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     if (attendanceRecords.length === 0) {
//       return { message: "No overtime records found." };
//     }

//     let totalOvertime = 0;
//     const recordsToUpdate = [];

//     // 1. Calculate total overtime
//     for (const record of attendanceRecords) {
//       totalOvertime += record.overtime;
//       recordsToUpdate.push(record);
//     }

//     const leavesToGrant = Math.floor(totalOvertime / 4.5);
//     const overtimeToConvert = leavesToGrant * 4.5;
//     let remainingToConvert = overtimeToConvert;

//     if (leavesToGrant === 0) {
//       return { message: "Not enough overtime to convert into leave." };
//     }

//     // 2. Update each attendance record accordingly
//     for (const record of recordsToUpdate) {
//       if (remainingToConvert === 0) break;

//       if (record.overtime <= remainingToConvert) {
//         // Use full overtime from this record
//         await prisma.attendance.update({
//           where: { id: record.id },
//           data: { overtime: 0 },
//         });
//         remainingToConvert -= record.overtime;
//       } else {
//         // Partially use this record's overtime
//         await prisma.attendance.update({
//           where: { id: record.id },
//           data: { overtime: record.overtime - remainingToConvert },
//         });
//         remainingToConvert = 0;
//       }
//     }

//     return {
//       message: `Converted ${overtimeToConvert}h overtime into ${leavesToGrant * 0.5} day(s) leave.`,
//       leavesGranted: leavesToGrant * 0.5,
//     };
//   } catch (e) {
//     console.error("Error converting overtime to leave:", e);
//     throw new Error("Conversion failed.");
//   }
// };

exports.convertOvertimeToLeave = async (employeeId) => {
  try {
    console.log(employeeId)
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId,
        overtime: {
          gt: 0,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    console.log("hsdvcjasdchjavkjc",attendanceRecords)
    if (attendanceRecords.length === 0) {
      return { message: "No overtime records found." };
    }

    let totalOvertime = 0;
    const recordsToUpdate = [];

    // 1. Calculate total overtime in ms
    for (const record of attendanceRecords) {
      totalOvertime += record.overtime;
      recordsToUpdate.push(record);
    }

    // const overtimeThresholdMs = 4.5 * 60 * 60 * 1000; // 4.5 hours in ms
    const overtimeThresholdMs = 3 * 60 * 1000; // 3 minutes in ms

    console.log("THis is total overtime and overtimeThresholdMs and leavesToGrant",totalOvertime,"ashcvjhascasvjhcasj",overtimeThresholdMs,"vajcvhsvcjhascacbakcjak",Math.floor(totalOvertime / overtimeThresholdMs))
    const leavesToGrant = Math.floor(totalOvertime / overtimeThresholdMs);
    const overtimeToConvert = leavesToGrant * overtimeThresholdMs;
    let remainingToConvert = overtimeToConvert;

    if (leavesToGrant === 0) {
      const remainingOvertimeHours = totalOvertime / (60 * 60 * 1000);
      console.log("hhhhhhhhhhhhhhhhhh",leavesToGrant,remainingOvertimeHours)
      return { 
        message: "Not enough overtime to convert into leave.",
        overtimeConvertedInHours:leavesToGrant,
        remainingOvertimeHours,
      };
    }

    // 2. Update records
    for (const record of recordsToUpdate) {
      if (remainingToConvert === 0) break;

      if (record.overtime <= remainingToConvert) {
        await prisma.attendance.update({
          where: { id: record.id },
          data: { overtime: 0 },
        });
        remainingToConvert -= record.overtime;
      } else {
        await prisma.attendance.update({
          where: { id: record.id },
          data: { overtime: record.overtime - remainingToConvert },
        });
        remainingToConvert = 0;
      }
    }

   

    const convertedHours = overtimeToConvert / (60 * 60 * 1000);
    const remainingOvertime = totalOvertime - overtimeToConvert;
    const remainingOvertimeHours = remainingOvertime / (60 * 60 * 1000);

    console.log("bbbbbbbbbbbbb",convertedHours,remainingOvertime,remainingOvertimeHours,leavesToGrant)

    return {
      message: `Converted ${convertedHours.toFixed(2)}h overtime into ${(leavesToGrant * 0.5).toFixed(1)} day(s) leave.`,
      overtimeConvertedInHours: parseFloat(convertedHours.toFixed(2)),
      remainingOvertimeInHours: parseFloat(remainingOvertimeHours.toFixed(2)),
      leavesGranted: leavesToGrant * 0.5,
    };
  } catch (e) {
    console.error("Error converting overtime to leave:", e);
    throw new Error("Conversion failed.");
  }
};

