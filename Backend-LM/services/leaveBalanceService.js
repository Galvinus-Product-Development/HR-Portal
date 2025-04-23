const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config(); // Load environment variables
const axios = require("axios");

exports.getLeaveBalance = async (employeeId) => {
  try {   
    // 1. Fetch employee from Employee Microservice
    const employeeServiceUrl = `${process.env.EMPLOYEE_SERVICE_URL}/${employeeId}`;
    const { data: employee } = await axios.get(employeeServiceUrl);
    if (!employee) {
      throw new Error("Employee not found");
    }

    // 2. Fetch leave balances (CASUAL, SICK, COMPENSATORY)
    const leaveBalances = await prisma.leaveBalance.findMany({
      where: {
        employeeId,
      },
    });
    console.log("This is leave balance", leaveBalances);
    const balanceMap = {
      CASUAL: 0,
      SICK: 0,
      COMPENSATORY: 0, // to be updated below
      UNPAID:0
    };

    leaveBalances.forEach((record) => {
      balanceMap[record.leaveType] = record.balance;
    });

    // 3. Fetch compensatory leave from Attendance (Overtime) Microservice
    const overtimeServiceUrl = `${process.env.OVERTIME_SERVICE_URL}/api/overtime/fetchAndUpdateOvertime/${employeeId}`;
    const { data: overtimeData } = await axios.get(overtimeServiceUrl);

    if (
      overtimeData &&
      typeof overtimeData.data.leavesGranted === "number" &&
      overtimeData.data.leavesGranted > 0
    ) {
      const existingCompensatory = leaveBalances.find(
        (lb) => lb.leaveType === "COMPENSATORY"
      );
      console.log("Existingcompensatorydata",existingCompensatory)
      if (existingCompensatory) {
        // Update existing COMPENSATORY balance
        await prisma.leaveBalance.update({
          where: { id: existingCompensatory.id },
          data: {
            balance: existingCompensatory.balance + overtimeData.leavesGranted,
          },
        });
        balanceMap.COMPENSATORY =
          existingCompensatory.balance + overtimeData.leavesGranted;
      } else {
        // Create new COMPENSATORY leave balance record
        
        const newRecord = await prisma.leaveBalance.create({
          data: {
            employeeId: employee.id,
            leaveType: "COMPENSATORY",
            balance: overtimeData.data.leavesGranted,
          },
        });
        balanceMap.COMPENSATORY = newRecord.balance;
      }
    }
    // 4. Return all balances
    return {
      casualBalance: balanceMap.CASUAL,
      sickBalance: balanceMap.SICK,
      compensatoryBalance: balanceMap.COMPENSATORY,
      remainingOvertimeInHours: overtimeData.data.remainingOvertimeHours,
    };
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    throw new Error("Failed to fetch leave balance.");
  }
};

exports.createBalance = async (employeeId, balanceData) => {
  try {
    // Create or ensure default CASUAL and SICK leave balances
    // const leaveTypes = [
    //     { leaveType: 'CASUAL', defaultBalance: 15 },
    //     { leaveType: 'SICK', defaultBalance: 5 }
    // ];
    const createdRecords = [];
    console.log("employeeId:", employeeId);
    console.log("balanceData:", balanceData);
    const employeeServiceUrl = `${process.env.EMPLOYEE_SERVICE_URL}/${employeeId}`;
    const { data: employee } = await axios.get(employeeServiceUrl);
    if (!employee) {
      throw new Error("Employee not found");
    }

    for (const type of balanceData) {
      const existing = await prisma.leaveBalance.findFirst({
        where: {
          employeeId,
          leaveType: type.leaveType,
        },
      });

      if (!existing) {
        const newRecord = await prisma.leaveBalance.create({
          data: {
            employeeId,
            leaveType: type.leaveType,
            balance: type.defaultBalance,
          },
        });
        createdRecords.push(newRecord);
      } else {
        createdRecords.push(existing);
      }
    }

    return createdRecords;
  } catch (error) {
    console.error("Error creating leave balance:", error);
    throw new Error("Failed to create leave balance.");
  }
};
