// Delete Leave Record
const deleteLeave = async (req, res) => {
  try {
    const { LeaveID } = req.params;
  const deleted = await Leave.deleteLeave(LeaveID);
    if (deleted) {
      res.json({ message: "Leave record deleted" });
    } else {
      res.status(404).json({ message: "Leave not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const Leave = require("../models/leaveModel");

// Create Leave Record
const createLeave = async (req, res) => {
  try {
    const { UserID, LeaveType, LeaveDays, MonthYear } = req.body;

    if (!UserID || !LeaveType || !LeaveDays || !MonthYear) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Set status to Approved if created by HR/Admin
    let Status = "Pending";
    if (req.user && (req.user.role === "HR" || req.user.role === "Admin")) {
      Status = "Approved";
    }

    const leaveId = await Leave.create({ UserID, LeaveType, LeaveDays, MonthYear, Status });
    res.status(201).json({ message: "Leave record created", LeaveID: leaveId });
  } catch (err) {
    console.error("❌ Error creating leave:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get All Leaves
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.getAll();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Get Leaves by User
const getUserLeaves = async (req, res) => {
  try {
    const leaves = await Leave.getByUserId(req.params.id);
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Update Leave Record (HR/Admin corrections)
const updateLeave = async (req, res) => {
  try {
    const { LeaveID } = req.params;
    const { LeaveType, LeaveDays, MonthYear, Status } = req.body;

    if (!LeaveType || !LeaveDays || !MonthYear || !Status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updated = await Leave.update(LeaveID, { LeaveType, LeaveDays, MonthYear, Status });
    if (updated) {
      res.json({ message: "Leave record updated" });
    } else {
      res.status(404).json({ message: "Leave not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createLeave, getAllLeaves, getUserLeaves, updateLeave, deleteLeave };