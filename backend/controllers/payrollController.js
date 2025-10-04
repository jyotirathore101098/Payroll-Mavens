
const PayrollBase = require("../models/payrollBaseModel");

// Create payroll base record
const create = async (req, res) => {
  try {
    const { UserID, BasicSalary, HRA = 0, DA = 0, OtherAllowance = 0 } = req.body;

    if (!UserID || !BasicSalary) {
      return res.status(400).json({ error: "UserID and BasicSalary are required" });
    }

    console.log("Create payload:", req.body);

    const id = await PayrollBase.create({ UserID, BasicSalary, HRA, DA, OtherAllowance });
    res.status(201).json({ message: "Payroll base created", id });
  } catch (err) {
    console.error("Error creating payroll:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all payroll base records
const getAll = async (req, res) => {
  try {
    const payrolls = await PayrollBase.getAll();
    res.json(payrolls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get payroll base by userId
const getByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const payroll = await PayrollBase.getByUserId(userId);
    if (!payroll) return res.status(404).json({ error: "Not found" });
    res.json(payroll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update payroll base record
const update = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { BasicSalary = 0, HRA = 0, DA = 0, OtherAllowance = 0 } = req.body;

    console.log("Update payload:", req.body, "UserID:", userId);

    await PayrollBase.update(userId, { BasicSalary, HRA, DA, OtherAllowance });
    res.json({ message: "Payroll base updated" });
  } catch (err) {
    console.error("Error updating payroll:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { create, getAll, getByUserId, update };
