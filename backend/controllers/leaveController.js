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
    const { UserID, LeaveType, FromDate, ToDate } = req.body;

    if (!UserID || !LeaveType || !FromDate || !ToDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate LeaveDays (inclusive)
    const from = new Date(FromDate);
    const to = new Date(ToDate);
    if (isNaN(from) || isNaN(to) || from > to) {
      return res.status(400).json({ message: "Invalid date range" });
    }
    const LeaveDays = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

    // Set status to Approved if created by HR/Admin
    let Status = "Pending";
    if (req.user && (req.user.role === "HR" || req.user.role === "Admin")) {
      Status = "Approved";
    }

    const leaveId = await Leave.create({ UserID, LeaveType, FromDate, ToDate, LeaveDays, Status });
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

// Get leaves for logged-in employee
const getOwnLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;
    const leaves = await Leave.getByUserId(userId);
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Update Leave Record (HR/Admin corrections)
const updateLeave = async (req, res) => {
  try {
    const { LeaveID } = req.params;
    const { LeaveType, FromDate, ToDate, Status } = req.body;

    if (!LeaveType || !FromDate || !ToDate || !Status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate LeaveDays (inclusive)
    const from = new Date(FromDate);
    const to = new Date(ToDate);
    if (isNaN(from) || isNaN(to) || from > to) {
      return res.status(400).json({ message: "Invalid date range" });
    }
    const LeaveDays = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const updated = await Leave.update(LeaveID, { LeaveType, FromDate, ToDate, LeaveDays, Status });
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
module.exports.getOwnLeaves = getOwnLeaves;