const db = require("../config/db");

// Insert payroll run record
const createPayrollRun = async (data) => {
  const { UserID, MonthYear, GrossSalary, PF, ESI, TDS, NetSalary, Bonus, Deduction } = data;

  const [result] = await db.execute(
    `INSERT INTO PayrollRuns (UserID, MonthYear, GrossSalary, PF, ESI, TDS, NetSalary, Bonus, Deduction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [UserID, MonthYear, GrossSalary, PF, ESI, TDS, NetSalary, Bonus, Deduction]
  );

  return result.insertId;
};

// Fetch all payroll runs
const getAllPayrollRuns = async () => {
  const [rows] = await db.execute(
    `SELECT * FROM PayrollRuns ORDER BY CreatedAt ASC`
  );
  return rows;
};

// Fetch payroll runs for a specific user
const getPayrollRunsByUser = async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM PayrollRuns WHERE UserID = ? ORDER BY CreatedAt ASC`,
    [userId]
  );
  return rows;
};

// Fetch payroll run by ID
const getById = async (payrollRunId) => {
  const [rows] = await db.execute(
    `SELECT * FROM PayrollRuns WHERE PayrollRunID = ?`,
    [payrollRunId]
  );
  return rows[0];
};

// Delete payroll run by ID
const deleteById = async (payrollRunId) => {
  await db.execute('DELETE FROM PayrollRuns WHERE PayrollRunID = ?', [payrollRunId]);
};

module.exports = { createPayrollRun, getAllPayrollRuns, getPayrollRunsByUser, getById, deleteById };
