const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config(); // Load environment variables
const axios = require("axios");

// Helper to calculate days (you can adapt this as needed)
const calculateDays = (startDate, endDate) => {
  const diffTime = new Date(endDate) - new Date(startDate);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
  try {
    // Fetch employee from the Employee Microservice
    console.log("................................................................///////////////////////////////////",leaveRequestData)
    const employeeServiceUrl = `${process.env.EMPLOYEE_SERVICE_URL}/${leaveRequestData.employeeId}`;
    console.log("////////////////////////////////////////////////////////////////////",employeeServiceUrl)
    const { data: employee } = await axios.get(employeeServiceUrl);

    if (!employee) {
      throw new Error(
        "Employee not found. Ensure that the employee is registered."
      );
    }

    // Convert startDate and endDate to IST
    const ISTOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const startDateIST = new Date(
      new Date(leaveRequestData.startDate).getTime() + ISTOffsetMs
    );
    const endDateIST = new Date(
      new Date(leaveRequestData.endDate).getTime() + ISTOffsetMs
    );

    // Create leave request in the local database
    return await prisma.leaveRequest.create({
      data: {
        ...leaveRequestData,
        lineManagerId:employee.employmentDetails.lineManagerId,
        startDate: startDateIST,
        endDate: endDateIST,
      },
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    throw new Error("Failed to create leave request. Please try again.");
  }
};

exports.getLeaveRequestById = async (id) => {
  return await prisma.leaveRequest.findUnique({
    where: { id },
  });
};

// exports.getAllLeaveRequests = async (employeeId) => {

//   console.log("I came upto here..................")

//   return await prisma.leaveRequest.findMany({ where: { employeeId } });
// };


exports.getAllLeaveRequests = async () => {
  return await prisma.leaveRequest.findMany({
    where: {
      status: "PENDING", // Only fetch pending leave requests
    },
  });
};





const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || "http://employee-service-url/api/employees";

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
          const response = await axios.get(`${EMPLOYEE_SERVICE_URL}/${leaveRequest.employeeId}`);
          console.log(response)
          const { name  } = response.data.personalDetails; // Extract name and department
          const {  department } = response.data.employmentDetails;
          return {
            ...leaveRequest,
            name,
            department,
          };
        } catch (error) {
          console.error(`Error fetching employee ${leaveRequest.employeeId}:`, error.message);
          return {
            ...leaveRequest,
            name: "Unknown",
            department: "Unknown",
          };
        }
      })
    );
    console.log("current data..............",requestsWithEmployeeData)
    return requestsWithEmployeeData;
  } catch (error) {
    console.error("Error fetching pending leave requests:", error);
    throw new Error("Failed to retrieve pending leave requests");
  }
};








exports.updateLeaveRequest = async (id, updateData) => {
  // Use the UUID directly – no conversion needed!
  if (updateData.status === "APPROVED" || updateData.status === "REJECTED") {
    updateData.decisionAt = new Date();
  }

  // Update the leave request using the UUID id as provided.
  const updatedRequest = await prisma.leaveRequest.update({
    where: { id },
    data: updateData,
  });

  // Process leave history for APPROVED or REJECTED decisions.
  if (updateData.status === "APPROVED") {
    const duration = calculateDays(
      updatedRequest.startDate,
      updatedRequest.endDate
    );
    let paidLeaveIncrement = 0;
    let unpaidLeaveIncrement = 0;

    if (updatedRequest.leaveType === "CASUAL") {
      const casualAggregate = await prisma.leaveHistory.aggregate({
        _sum: { paidLeave: true },
        where: {
          employeeId: updatedRequest.employeeId,
          leaveType: "CASUAL",
          status: "APPROVED",
        },
      });
      const usedCasual = casualAggregate._sum.paidLeave || 0;
      const remainingCasual = Math.max(15 - usedCasual, 0);

      if (duration <= remainingCasual) {
        paidLeaveIncrement = duration;
      } else {
        paidLeaveIncrement = remainingCasual;
        unpaidLeaveIncrement = duration - remainingCasual;
      }
    } else if (updatedRequest.leaveType === "SICK") {
      const sickAggregate = await prisma.leaveHistory.aggregate({
        _sum: { paidLeave: true },
        where: {
          employeeId: updatedRequest.employeeId,
          leaveType: "SICK",
          status: "APPROVED",
        },
      });
      const usedSick = sickAggregate._sum.paidLeave || 0;
      const remainingSick = Math.max(5 - usedSick, 0);

      if (duration <= remainingSick) {
        paidLeaveIncrement = duration;
      } else {
        paidLeaveIncrement = remainingSick;
        unpaidLeaveIncrement = duration - remainingSick;
      }
    } else {
      paidLeaveIncrement = 0;
      unpaidLeaveIncrement = duration;
    }

    const leaveHistoryPayload = {
      employeeId: updatedRequest.employeeId,
      leaveType: updatedRequest.leaveType,
      duration: duration,
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
  } else if (updateData.status === "REJECTED") {
    const duration = calculateDays(
      updatedRequest.startDate,
      updatedRequest.endDate
    );
    const leaveHistoryPayload = {
      employeeId: updatedRequest.employeeId,
      leaveType: updatedRequest.leaveType,
      duration: duration,
      appliedOn: updatedRequest.appliedOn,
      startDate: updatedRequest.startDate,
      endDate: updatedRequest.endDate,
      status: updatedRequest.status,
      adminRemarks: updatedRequest.adminRemarks || "",
      supportingDocs: updatedRequest.supportingDocs || null,
      paidLeave: 0,
      unpaidLeave: 0,
    };

    await prisma.leaveHistory.create({
      data: leaveHistoryPayload,
    });
  }

  return updatedRequest;
};

exports.deleteLeaveRequest = async (id) => {
  return await prisma.leaveRequest.delete({
    where: { id },
  });
};
