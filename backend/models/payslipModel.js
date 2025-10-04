// Delete payslip by ID
const deleteById = async (id) => {
  await pool.query('DELETE FROM Payslips WHERE PayslipID = ?', [id]);
};
// Fetch all payslips (for admin/HR report)
const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT p.PayslipID, r.UserID, r.MonthYear, r.NetSalary, p.FilePath
     FROM Payslips p
     JOIN PayrollRuns r ON p.PayrollRunID = r.PayrollRunID
     ORDER BY p.GeneratedAt DESC`
  );
  return rows;
};


const pool = require("../config/db");

// ✅ Create payslip record in DB
const create = async (payrollRunId, filePath) => {
  const [result] = await pool.query(
    `INSERT INTO Payslips (PayrollRunID, FilePath) VALUES (?, ?)`,
    [payrollRunId, filePath]
  );
  return result.insertId;
};

// ✅ Fetch payslips for a user
const getByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT p.PayslipID, r.UserID, p.FilePath, p.GeneratedAt, r.MonthYear, r.NetSalary
     FROM Payslips p
     JOIN PayrollRuns r ON p.PayrollRunID = r.PayrollRunID
     WHERE r.UserID = ?
     ORDER BY p.GeneratedAt DESC`,
    [userId]
  );
  return rows;
};

// ✅ Fetch a single payslip
const getById = async (payslipId) => {
  const [rows] = await pool.query(
    `SELECT p.*, r.UserID, r.MonthYear, r.NetSalary
     FROM Payslips p
     JOIN PayrollRuns r ON p.PayrollRunID = r.PayrollRunID
     WHERE p.PayslipID = ?`,
    [payslipId]
  );
  return rows[0];
};

module.exports = { create, getByUser, getById, getAll, deleteById };
