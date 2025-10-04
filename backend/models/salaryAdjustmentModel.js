const db = require("../config/db");

//  Create salary adjustment
const create = async ({ UserID, AdjustmentType, Amount, MonthYear, Remarks }) => {
  const [result] = await db.execute(
    `INSERT INTO SalaryAdjustments (UserID, AdjustmentType, Amount, MonthYear, Remarks)
     VALUES (?, ?, ?, ?, ?)`,
    [UserID, AdjustmentType, Amount, MonthYear, Remarks || null]
  );
  return result.insertId;
};

//  Get all adjustments
const getAll = async () => {
  const [rows] = await db.execute(
    `SELECT sa.*, u.Name
     FROM SalaryAdjustments sa
     JOIN Users u ON sa.UserID = u.UserID
     ORDER BY sa.CreatedAt DESC`
  );
  return rows;
};

//  Get adjustments by UserID
const getByUserId = async (UserID) => {
  const [rows] = await db.execute(
    `SELECT * FROM SalaryAdjustments WHERE UserID = ? ORDER BY CreatedAt DESC`,
    [UserID]
  );
  return rows;
};

//  Update adjustment
const update = async (AdjustmentID, { AdjustmentType, Amount, MonthYear, Remarks }) => {
  const [result] = await db.execute(
    `UPDATE SalaryAdjustments 
     SET AdjustmentType = ?, Amount = ?, MonthYear = ?, Remarks = ?
     WHERE AdjustmentID = ?`,
    [AdjustmentType, Amount, MonthYear, Remarks, AdjustmentID]
  );
  return result.affectedRows;
};

//  Delete adjustment
const remove = async (AdjustmentID) => {
  const [result] = await db.execute(
    `DELETE FROM SalaryAdjustments WHERE AdjustmentID = ?`,
    [AdjustmentID]
  );
  return result.affectedRows;
};
const getByUserIdAndMonth = async (userId, monthYear) => {
  const [rows] = await db.execute(
    `SELECT * FROM SalaryAdjustments WHERE UserID = ? AND MonthYear = ?`,
    [userId, monthYear]
  );
  return rows;
};

module.exports = { create, getAll, getByUserId, update, remove, getByUserIdAndMonth };
