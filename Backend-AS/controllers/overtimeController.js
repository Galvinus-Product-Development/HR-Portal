const overtimeService = require("../services/overtimeService");

exports.addOvertime = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date, startTime, endTime, reason } = req.body;
    console.log("###############", req.body);

    if (!date || !startTime || !endTime || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const { overtime, duration } = await overtimeService.createOvertime({
      employeeId,
      date,
      startTime,
      endTime,
      reason,
    });

    res.status(201).json({
      message: "Overtime request submitted successfully.",
      overtime,
      duration: `${duration.hours} hours and ${duration.minutes} minutes`,
    });
  } catch (error) {
    console.error("Error adding overtime:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.claimOvertime = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body; // expecting milliseconds
    console.log("duration in claim overtime",duration)

    if (!id || duration == null) {
      return res
        .status(400)
        .json({ message: "Overtime ID and claimed duration are required." });
    }

    const updatedOvertime = await overtimeService.claimOvertime(id, duration);

    console.log(updatedOvertime, "controllers updatedOvertime");

    res.status(200).json({
      message: "Overtime claim submitted successfully.",
      data: updatedOvertime,
    });
  } catch (error) {
    console.error("Error updating overtime status:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getOvertimeById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const data = await overtimeService.getOvertimeById(employeeId);

    if (!data.length) {
      return res
        .status(404)
        .json({ message: "No overtime records found for this employee." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching overtime by ID:", error);
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

exports.getOvertime = async (req, res) => {
  try {
    const data = await overtimeService.getOvertime();

    if (!data.length) {
      return res.status(404).json({ message: "No overtime records found." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching all overtime records:", error);
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

exports.updateOvertime = async (req, res) => {
  try {
    const { id } = req.params;
    const { overtimeStatus } = req.body;
    console.log(id, overtimeStatus);

    if (!overtimeStatus) {
      return res.status(400).json({ message: "Overtime status is required." });
    }

    const updatedOvertime = await overtimeService.updateOvertimeStatus(
      id,
      overtimeStatus
    );

    res.status(200).json({
      message: "Overtime status updated successfully.",
      data: updatedOvertime,
    });
  } catch (error) {
    console.error("Error updating overtime status:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.unclaimedOvertime = async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log(employeeId, "This is employeeid");

    if (!employeeId) {
      return res.status(400).json({
        message: "Employee ID is required.",
      });
    }

    const data = await overtimeService.getUnclaimedOvertime(employeeId);

    if (!data.length) {
      return res.status(404).json({
        message: "No unclaimed overtime records found for this employee.",
      });
    }

    res.status(200).json({
      message: "Unclaimed overtime records retrieved successfully.",
      data,
    });
  } catch (error) {
    console.error("Error fetching unclaimed overtime:", error);
    res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const id = req.params;
    const { status } = req.body;
    const data = await overtimeService.updateClaimStatus(id, status);
    res.status(200).json({
      message: "OverTime claim status updated ",
      data,
    });
  } catch (e) {
    console.log("");
    res.status(500).json({
      message: "Error while updating OverTime claim status.",
      error: error.message,
    });
  }
};
exports.fetchAndUpdateOvertime = async (req, res) => {
  try {
    const {employeeId} = req.params;
    const data = await overtimeService.convertOvertimeToLeave(employeeId);
    res.status(200).json({
      message: "success ",
      data,
    });
  } catch (e) {
  
    res.status(500).json({
      message: "Error while fetching overtime.",
      error: error.message,
    });
  }
};
