const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config(); // Load environment variables
const axios = require("axios");

// Helper to calculate days (you can adapt this as needed)
const calculateWorkingDays = (
  startDate,
  endDate,
  weekOffDays = [0, 6],
  holidayDates = []
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  let current = new Date(start);

  while (current <= end) {
    const iso = current.toISOString().split("T")[0];
    const isWeekOff = weekOffDays.includes(current.getDay());
    const isHoliday = holidayDates.includes(iso);

    if (!isWeekOff && !isHoliday) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

// exports.createLeaveRequest = async (leaveRequestData) => {
// 	const employee = await prisma.employee.findUnique({
// 		where: { employeeId: leaveRequestData.employeeId },
// 	});

// 	if (!employee) {
// 		throw new Error("Employee not found. Ensure that the employee is registered.");
// 	}

// 	const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

// 	// Convert startDate and endDate to IST
// 	const startDateIST = new Date(new Date(leaveRequestData.startDate).getTime() + ISTOffsetMs);
// 	const endDateIST = new Date(new Date(leaveRequestData.endDate).getTime() + ISTOffsetMs);

// 	return await prisma.leaveRequest.create({
// 		data: { ...leaveRequestData, startDate: startDateIST, endDate: endDateIST }
// 	});
// };

exports.createLeaveRequest = async (leaveRequestData) => {
  const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });

  if (holidays.length === 0) {
    throw new Error("No holidays found");
  }

  // For getting array of dates of type YYYY/MM/DD format.
  const holidayDates = holidays.map(
    (holiday) => new Date(holiday.date).toISOString().split("T")[0]
  );

  // Fetch employee from the Employee Microservice
  const employeeServiceUrl = `${process.env.EMPLOYEE_SERVICE_URL}/${leaveRequestData.employeeId}`;
  const { data: employee } = await axios.get(employeeServiceUrl);

  if (!employee) {
    throw new Error(
      "Employee not found. Ensure that the employee is registered."
    );
  }

  // Convert startDate and endDate
  const startDate = new Date(leaveRequestData.startDate);
  const endDate = new Date(leaveRequestData.endDate);

  // Check if startDate is a holiday
  const startDateStr = startDate.toISOString().split("T")[0];
  if (holidayDates.includes(startDateStr)) {
    throw new Error(
      "Leave cannot start on a holiday. Please choose a working day as the start date."
    );
  }

  // Generate all dates between start and end
  const getDatesBetween = (start, end) => {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const allDates = getDatesBetween(startDate, endDate);
  console.log("All dates :::", allDates);

  // Define weekoff (0 = Sunday)
  const weekOffDays = [0, 6]; // You can add more, e.g., [0, 6] for Sunday & Saturday

  // Filter out weekoffs and holidays
  const validLeaveDates = allDates.filter((date) => {
    const dateStr = date.toISOString().split("T")[0];
    const isWeekOff = weekOffDays.includes(date.getDay());
    const isHoliday = holidayDates.includes(dateStr);
    return !isWeekOff && !isHoliday;
  });
  console.log("valid leaves dates ::::", validLeaveDates);

  if (validLeaveDates.length === 0) {
    throw new Error(
      "Leave request falls entirely on weekoff days and/or holidays. Please choose valid working days."
    );
  }

  // Use original range, or optionally: adjust based on validLeaveDates
  const startDateIST = new Date(validLeaveDates[0]);
  const endDateIST = new Date(validLeaveDates[validLeaveDates.length - 1]);

  // Step: Check if any leave request already exists on these dates
  const overlappingLeaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId: leaveRequestData.employeeId,
      OR: validLeaveDates.map((date) => ({
        startDate: { lte: date },
        endDate: { gte: date },
      })),
      status: { not: "REJECTED" }, // Optional: ignore rejected requests
    },
  });

  if (overlappingLeaves.length > 0) {
    throw new Error(
      "One or more days in this leave request overlap with an existing leave request."
    );
  }

  return await prisma.leaveRequest.create({
    data: {
      ...leaveRequestData,
      startDate: startDateIST,
      endDate: endDateIST,
    },
  });
};

exports.getLeaveRequestById = async (id) => {
  return await prisma.leaveRequest.findUnique({
    where: { id },
  });
};

exports.getAllLeaveRequests = async (employeeId) => {
  return await prisma.leaveRequest.findMany({ where: { employeeId } });
};

const EMPLOYEE_SERVICE_URL =
  process.env.EMPLOYEE_SERVICE_URL ||
  "http://employee-service-url/api/employees";

exports.getPendingLeaveRequests = async (lineManagerId) => {
  try {
    // Fetch pending leave requests from the database
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        lineManagerId,
        status: "PENDING",
      },
    });

    // Fetch employee details for each leave request
    const requestsWithEmployeeData = await Promise.all(
      leaveRequests.map(async (leaveRequest) => {
        try {
          // Call Employee Service to get employee details
          const response = await axios.get(
            `${EMPLOYEE_SERVICE_URL}/${leaveRequest.employeeId}`
          );
          console.log(response);
          const { name } = response.data.personalDetails; // Extract name and department
          const { department } = response.data.employmentDetails;
          return {
            ...leaveRequest,
            name,
            department,
          };
        } catch (error) {
          console.error(
            `Error fetching employee ${leaveRequest.employeeId}:`,
            error.message
          );
          return {
            ...leaveRequest,
            name: "Unknown",
            department: "Unknown",
          };
        }
      })
    );
    console.log("current data..............", requestsWithEmployeeData);
    return requestsWithEmployeeData;
  } catch (error) {
    console.error("Error fetching pending leave requests:", error);
    throw new Error("Failed to retrieve pending leave requests");
  }
};

exports.updateLeaveRequest = async (id, updateData) => {
  // Use the UUID directly – no conversion needed!
  try {
    if (updateData.status === "APPROVED" || updateData.status === "REJECTED") {
      updateData.decisionAt = new Date();
    }
    console.log("Update data : ", updateData);

    const holidays = await prisma.holiday.findMany({
      orderBy: { date: "asc" },
    });
    const holidayDates = holidays.map(
      (holiday) => new Date(holiday.date).toISOString().split("T")[0]
    );

    // Update the leave request using the UUID id as provided.
    const updatedRequest = await prisma.leaveRequest.update({
      where: { id },
      data: updateData,
    });

    const leaveBalances = await prisma.leaveBalance.findMany({
      where: { employeeId: updatedRequest.employeeId },
    });

    const leaveBalanceMap = {};
    leaveBalances.forEach((balance) => {
      leaveBalanceMap[balance.leaveType] = balance.balance;
    });

    if (updateData.status === "APPROVED") {
      if (updatedRequest.leaveDuration === "FULL_DAY") {
        const duration = calculateWorkingDays(
          updatedRequest.startDate,
          updatedRequest.endDate,
          [0, 6], // weekOffDays
          holidayDates
        );

        let paidLeaveIncrement = 0;
        let unpaidLeaveIncrement = 0;

        if (
          updatedRequest.leaveType === "CASUAL" ||
          updatedRequest.leaveType === "SICK" ||
          updatedRequest.leaveType === "COMPENSATORY"
        ) {
          const type = updatedRequest.leaveType;
          const remainingBalance = leaveBalanceMap[type] || 0;

          if (
            updatedRequest.leaveType === "COMPENSATORY" &&
            remainingBalance <= 0
          ) {
            throw new Error(
              "Failed to process request as compensatory balance is 0"
            );
          }

          if (duration <= remainingBalance) {
            paidLeaveIncrement = duration;
            unpaidLeaveIncrement = 0;
          } else {
            paidLeaveIncrement = remainingBalance;
            unpaidLeaveIncrement = duration - remainingBalance;
          }

          await prisma.leaveBalance.update({
            where: {
              employeeId_leaveType: {
                employeeId: updatedRequest.employeeId,
                leaveType: type,
              },
            },
            data: {
              balance: Math.max(remainingBalance - paidLeaveIncrement, 0),
            },
          });

          if (unpaidLeaveIncrement > 0) {
            // Increase UNPAID leave balance for excess days
            const unpaidLeaveBalance = leaveBalanceMap["UNPAID"] || 0;

            await prisma.leaveBalance.upsert({
              where: {
                employeeId_leaveType: {
                  employeeId: updatedRequest.employeeId,
                  leaveType: "UNPAID",
                },
              },
              update: {
                balance: unpaidLeaveBalance + unpaidLeaveIncrement,
              },
              create: {
                employeeId: updatedRequest.employeeId,
                leaveType: "UNPAID",
                balance: unpaidLeaveIncrement, // starting with the increment as initial balance
              },
            });
          }
        } else if (updatedRequest.leaveType === "UNPAID") {
          unpaidLeaveIncrement = duration;

          const unpaidLeaveBalance = leaveBalanceMap["UNPAID"] || 0;

          await prisma.leaveBalance.upsert({
            where: {
              employeeId_leaveType: {
                employeeId: updatedRequest.employeeId,
                leaveType: "UNPAID",
              },
            },
            update: {
              balance: unpaidLeaveBalance + unpaidLeaveIncrement,
            },
            create: {
              employeeId: updatedRequest.employeeId,
              leaveType: "UNPAID",
              balance: unpaidLeaveIncrement, // starting with the increment as initial balance
            },
          });
        } else {
          throw new Error(
            "Failed to process request as leave type is not recognized"
          );
        }

        const leaveHistoryPayload = {
          employeeId: updatedRequest.employeeId,
          leaveType: updatedRequest.leaveType,
          duration,
          appliedOn: updatedRequest.appliedOn,
          startDate: updatedRequest.startDate,
          endDate: updatedRequest.endDate,
          status: updatedRequest.status,
          adminRemarks: updatedRequest.adminRemarks || "",
          supportingDocs: updatedRequest.supportingDocs || null,
          paidLeave: paidLeaveIncrement,
          unpaidLeave: unpaidLeaveIncrement,
        };

        await prisma.leaveHistory.create({
          data: leaveHistoryPayload,
        });
      } else {
        const duration = 0.5;

        let paidLeaveIncrement = 0;
        let unpaidLeaveIncrement = 0;

        if (
          updatedRequest.leaveType === "CASUAL" ||
          updatedRequest.leaveType === "SICK" ||
          updatedRequest.leaveType === "COMPENSATORY"
        ) {
          const type = updatedRequest.leaveType;
          const remainingBalance = leaveBalanceMap[type] || 0;

          if (
            updatedRequest.leaveType === "COMPENSATORY" &&
            remainingBalance <= 0
          ) {
            throw new Error(
              "Failed to process request as compensatory balance is 0"
            );
          }

          if (duration <= remainingBalance) {
            paidLeaveIncrement = duration;
            unpaidLeaveIncrement = 0;
          } else {
            unpaidLeaveIncrement = duration;
          }

          await prisma.leaveBalance.update({
            where: {
              employeeId_leaveType: {
                employeeId: updatedRequest.employeeId,
                leaveType: type,
              },
            },
            data: {
              balance: Math.max(remainingBalance - paidLeaveIncrement, 0),
            },
          });

          if (unpaidLeaveIncrement > 0) {
            // Increase UNPAID leave balance for excess days
            const unpaidLeaveBalance = leaveBalanceMap["UNPAID"] || 0;

            // await prisma.leaveBalance.update({
            //   where: {
            //     employeeId_leaveType: {
            //       employeeId: updatedRequest.employeeId,
            //       leaveType: "UNPAID",
            //     },
            //   },
            //   data: {
            //     balance: unpaidLeaveBalance + unpaidLeaveIncrement,
            //   },
            // });

            await prisma.leaveBalance.upsert({
              where: {
                employeeId_leaveType: {
                  employeeId: updatedRequest.employeeId,
                  leaveType: "UNPAID",
                },
              },
              update: {
                balance: unpaidLeaveBalance + unpaidLeaveIncrement,
              },
              create: {
                employeeId: updatedRequest.employeeId,
                leaveType: "UNPAID",
                balance: unpaidLeaveIncrement, // starting with the increment as initial balance
              },
            });
          }
        } else if (updatedRequest.leaveType === "UNPAID") {
          unpaidLeaveIncrement = duration;

          const unpaidLeaveBalance = leaveBalanceMap["UNPAID"] || 0;

          // await prisma.leaveBalance.update({
          //   where: {
          //     employeeId_leaveType: {
          //       employeeId: updatedRequest.employeeId,
          //       leaveType: "UNPAID",
          //     },
          //   },
          //   data: {
          //     balance: unpaidLeaveBalance + unpaidLeaveIncrement,
          //   },
          // });

          await prisma.leaveBalance.upsert({
            where: {
              employeeId_leaveType: {
                employeeId: updatedRequest.employeeId,
                leaveType: "UNPAID",
              },
            },
            update: {
              balance: unpaidLeaveBalance + unpaidLeaveIncrement,
            },
            create: {
              employeeId: updatedRequest.employeeId,
              leaveType: "UNPAID",
              balance: unpaidLeaveIncrement, // starting with the increment as initial balance
            },
          });
        } else {
          throw new Error(
            "Failed to process request as leave type is not recognized"
          );
        }

        const leaveHistoryPayload = {
          employeeId: updatedRequest.employeeId,
          leaveType: updatedRequest.leaveType,
          duration,
          appliedOn: updatedRequest.appliedOn,
          startDate: updatedRequest.startDate,
          endDate: updatedRequest.endDate,
          status: updatedRequest.status,
          adminRemarks: updatedRequest.adminRemarks || "",
          supportingDocs: updatedRequest.supportingDocs || null,
          paidLeave: paidLeaveIncrement,
          unpaidLeave: unpaidLeaveIncrement,
        };

        await prisma.leaveHistory.create({
          data: leaveHistoryPayload,
        });
      }
    } else if (updateData.status === "REJECTED") {
      const duration = calculateWorkingDays(
        updatedRequest.startDate,
        updatedRequest.endDate,
        [0, 6], // weekOffDays
        holidayDates
      );

      await prisma.leaveHistory.create({
        data: {
          employeeId: updatedRequest.employeeId,
          leaveType: updatedRequest.leaveType,
          duration,
          appliedOn: updatedRequest.appliedOn,
          startDate: updatedRequest.startDate,
          endDate: updatedRequest.endDate,
          status: updatedRequest.status,
          adminRemarks: updatedRequest.adminRemarks || "",
          supportingDocs: updatedRequest.supportingDocs || null,
          paidLeave: 0,
          unpaidLeave: 0,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

exports.deleteLeaveRequest = async (id) => {
  return await prisma.leaveRequest.delete({
    where: { id },
  });
};

exports.editLeaveRequest = async (
  id,
  editStatus,
  startDateTemp,
  endDateTemp,
  reasonTemp
) => {
  const existingLeaveRequest = await prisma.leaveRequest.findUnique({
    where: { id },
  });
  console.log(existingLeaveRequest);

  if (!existingLeaveRequest) {
    throw new Error("No leave request with this Id");
  }

  const updateLeaveRequest = await prisma.leaveRequest.update({
    where: { id },
    data: {
      editStatus,
      startDateTemp,
      endDateTemp,
      reasonTemp,
    },
  });

  return updateLeaveRequest;
};

exports.approveEditedRequest = async (
  id,
  editStatus,
  startDateTemp,
  endDateTemp,
  reasonTemp,
  actionStatus
) => {
  const existingLeaveRequest = await prisma.leaveRequest.findUnique({
    where: { id },
  });
  console.log(existingLeaveRequest);

  if (!existingLeaveRequest) {
    throw new Error("No leave request with this Id");
  }

  const leaveBalances = await prisma.leaveBalance.findMany({
    where: { employeeId: existingLeaveRequest.employeeId },
  });

  const leaveBalanceMap = {};
  leaveBalances.forEach((balance) => {
    leaveBalanceMap[balance.leaveType] = balance.balance;
  });
  if (editStatus === "EDITED" && actionStatus === "APPROVED") {
    const duration = calculateWorkingDays(
      existingLeaveRequest.startDate,
      existingLeaveRequest.endDate,
      [0, 6], // weekOffDays
      holidayDates
    );
    if (existingLeaveRequest.leaveType === "SICK") {
      if (leaveBalanceMap["SICK"] + duration > 5) {
        //case for split into casual and unpaid
        const unpaidLeave = leaveBalanceMap["SICK"] + duration - 5;
        const paidLeave = Math.abs(duration - unpaidLeave);

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "SICK",
            },
          },
          data: {
            balance: leaveBalanceMap["SICK"] + paidLeave,
          },
        });

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "UNPAID",
            },
          },
          data: {
            balance: leaveBalanceMap["UNPAID"] - unpaidLeave,
          },
        });
      } else {
        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "SICK",
            },
          },
          data: {
            balance: leaveBalanceMap["SICK"] + duration,
          },
        });
      }
    } else if (existingLeaveRequest.leaveType === "CASUAL") {
      if (leaveBalanceMap["CASUAL"] + duration > 15) {
        const unpaidLeave = leaveBalanceMap["CASUAL"] + duration - 15;
        const paidLeave = Math.abs(duration - unpaidLeave);

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "CASUAL",
            },
          },
          data: {
            balance: leaveBalanceMap["CASUAL"] + paidLeave,
          },
        });

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "UNPAID",
            },
          },
          data: {
            balance: leaveBalanceMap["UNPAID"] - unpaidLeave,
          },
        });

        //case for split into casual and unpaid
      } else {
        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "CASUAL",
            },
          },
          data: {
            balance: leaveBalanceMap["CASUAL"] + duration,
          },
        });
      }
    } else if (existingLeaveRequest.leaveType === "COMPENSATORY") {
      await prisma.leaveBalance.update({
        where: {
          employeeId_leaveType: {
            employeeId: existingLeaveRequest.employeeId,
            leaveType: "COMPENSATORY",
          },
        },
        data: {
          balance: leaveBalanceMap["COMPENSATORY"] + duration,
        },
      });
    } else {
      await prisma.leaveBalance.update({
        where: {
          employeeId_leaveType: {
            employeeId: existingLeaveRequest.employeeId,
            leaveType: "UNPAID",
          },
        },
        data: {
          balance: leaveBalanceMap["UNPAID"] - duration,
        },
      });
    }

    const leaveBalances = await prisma.leaveBalance.findMany({
      where: { employeeId: existingLeaveRequest.employeeId },
    });
  
    const leaveBalanceMap = {};
    leaveBalances.forEach((balance) => {
      leaveBalanceMap[balance.leaveType] = balance.balance;
    });

    const newDuration = calculateWorkingDays(
      startDateTemp,
      endDateTemp,
      [0, 6], // weekOffDays
      holidayDates
    );

    let paidLeaveIncrement = 0;
    let unpaidLeaveIncrement = 0;

    if (
      existingLeaveRequest.leaveType === "CASUAL" ||
      existingLeaveRequest.leaveType === "SICK" ||
      existingLeaveRequest.leaveType === "COMPENSATORY"
    ) {
      const type = existingLeaveRequest.leaveType;
      const remainingBalance = leaveBalanceMap[type] || 0;

      if (
        existingLeaveRequest.leaveType === "COMPENSATORY" &&
        remainingBalance <= 0
      ) {
        throw new Error(
          "Failed to process request as compensatory balance is 0"
        );
      }

      if (newDuration <= remainingBalance) {
        paidLeaveIncrement = newDuration;
        unpaidLeaveIncrement = 0;
      } else {
        paidLeaveIncrement = remainingBalance;
        unpaidLeaveIncrement = newDuration - remainingBalance;
      }

      await prisma.leaveBalance.update({
        where: {
          employeeId_leaveType: {
            employeeId: existingLeaveRequest.employeeId,
            leaveType: type,
          },
        },
        data: {
          balance: Math.max(remainingBalance - paidLeaveIncrement, 0),
        },
      });

      if (unpaidLeaveIncrement > 0) {
        // Increase UNPAID leave balance for excess days
        const unpaidLeaveBalance = leaveBalanceMap["UNPAID"] || 0;

        await prisma.leaveBalance.upsert({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "UNPAID",
            },
          },
          update: {
            balance: unpaidLeaveBalance + unpaidLeaveIncrement,
          },
          create: {
            employeeId: existingLeaveRequest.employeeId,
            leaveType: "UNPAID",
            balance: unpaidLeaveIncrement, // starting with the increment as initial balance
          },
        });
      }
    } else if (existingLeaveRequest.leaveType === "UNPAID") {
      unpaidLeaveIncrement = newDuration;

      const unpaidLeaveBalance = leaveBalanceMap["UNPAID"] || 0;

      await prisma.leaveBalance.upsert({
        where: {
          employeeId_leaveType: {
            employeeId: existingLeaveRequest.employeeId,
            leaveType: "UNPAID",
          },
        },
        update: {
          balance: unpaidLeaveBalance + unpaidLeaveIncrement,
        },
        create: {
          employeeId: updatedRequest.employeeId,
          leaveType: "UNPAID",
          balance: unpaidLeaveIncrement, // starting with the increment as initial balance
        },
      });
    } else {
      throw new Error(
        "Failed to process request as leave type is not recognized"
      );
    }

    const updateLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        editStatus:null,
        startDate: startDateTemp,
        endDate: endDateTemp,
        startDateTemp:"",
        endDateTemp:"",
        reasonTemp:"",
      },
    });
    return updateLeaveRequest;
  }
  else if(editStatus === "EDITED" && actionStatus === "REJECTED"){
    const updateLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        editStatus:null,
        startDateTemp:"",
        endDateTemp:"",
        reasonTemp:"",
      },
    });
    return updateLeaveRequest;
  }
  else if(editStatus==="CANCELLED"&&actionStatus==="APPROVED"){

    const duration = calculateWorkingDays(
      existingLeaveRequest.startDate,
      existingLeaveRequest.endDate,
      [0, 6], // weekOffDays
      holidayDates
    );
    if (existingLeaveRequest.leaveType === "SICK") {
      if (leaveBalanceMap["SICK"] + duration > 5) {
        //case for split into casual and unpaid
        const unpaidLeave = leaveBalanceMap["SICK"] + duration - 5;
        const paidLeave = Math.abs(duration - unpaidLeave);

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "SICK",
            },
          },
          data: {
            balance: leaveBalanceMap["SICK"] + paidLeave,
          },
        });

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "UNPAID",
            },
          },
          data: {
            balance: leaveBalanceMap["UNPAID"] - unpaidLeave,
          },
        });
      } else {
        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "SICK",
            },
          },
          data: {
            balance: leaveBalanceMap["SICK"] + duration,
          },
        });
      }
    } else if (existingLeaveRequest.leaveType === "CASUAL") {
      if (leaveBalanceMap["CASUAL"] + duration > 15) {
        const unpaidLeave = leaveBalanceMap["CASUAL"] + duration - 15;
        const paidLeave = Math.abs(duration - unpaidLeave);

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "CASUAL",
            },
          },
          data: {
            balance: leaveBalanceMap["CASUAL"] + paidLeave,
          },
        });

        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "UNPAID",
            },
          },
          data: {
            balance: leaveBalanceMap["UNPAID"] - unpaidLeave,
          },
        });

        //case for split into casual and unpaid
      } else {
        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveType: {
              employeeId: existingLeaveRequest.employeeId,
              leaveType: "CASUAL",
            },
          },
          data: {
            balance: leaveBalanceMap["CASUAL"] + duration,
          },
        });
      }
    } else if (existingLeaveRequest.leaveType === "COMPENSATORY") {
      await prisma.leaveBalance.update({
        where: {
          employeeId_leaveType: {
            employeeId: existingLeaveRequest.employeeId,
            leaveType: "COMPENSATORY",
          },
        },
        data: {
          balance: leaveBalanceMap["COMPENSATORY"] + duration,
        },
      });
    } else {
      await prisma.leaveBalance.update({
        where: {
          employeeId_leaveType: {
            employeeId: existingLeaveRequest.employeeId,
            leaveType: "UNPAID",
          },
        },
        data: {
          balance: leaveBalanceMap["UNPAID"] - duration,
        },
      });
    }





  }
  else if(editStatus==="CANCELLED"&&actionStatus==="REJECTED"){
    const updateLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        editStatus:null,
        startDateTemp:"",
        endDateTemp:"",
        reasonTemp:"",
      },
    });
    return updateLeaveRequest;
  }
};
