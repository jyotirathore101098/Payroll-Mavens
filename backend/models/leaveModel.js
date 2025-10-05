// ✅ Delete leave record
const deleteLeave = async (LeaveID) => {
  const [result] = await db.execute(
    `DELETE FROM LeaveRecords WHERE LeaveID = ?`,
    [LeaveID]
  );
  return result.affectedRows;
};

const db = require("../config/db");

// ✅ Create Leave Record
const create = async ({ UserID, LeaveType, LeaveDays, MonthYear, Status = "Pending" }) => {
  const [result] = await db.execute(
    `INSERT INTO LeaveRecords (UserID, LeaveType, LeaveDays, MonthYear, Status)
     VALUES (?, ?, ?, ?, ?)`,
    [UserID, LeaveType, LeaveDays, MonthYear, Status]
  );
  return result.insertId;
};

// ✅ Get all leave records
const getAll = async () => {
  const [rows] = await db.execute(
    `SELECT lr.*, u.Name AS UserName
FROM LeaveRecords lr
JOIN Users u ON lr.UserID = u.UserID
ORDER BY lr.CreatedAt DESC;`
  );
  return rows;
};

// ✅ Get leave records by UserID
const getByUserId = async (UserID) => {
  const [rows] = await db.execute(
    `SELECT * FROM LeaveRecords WHERE UserID = ? ORDER BY CreatedAt DESC`,
    [UserID]
  );
  return rows;
};

// ✅ Update leave (HR/Admin can correct LeaveDays or LeaveType)
const update = async (LeaveID, { LeaveType, LeaveDays, MonthYear }) => {
  const [result] = await db.execute(
    `UPDATE LeaveRecords 
     SET LeaveType = ?, LeaveDays = ?, MonthYear = ?
     WHERE LeaveID = ?`,
    [LeaveType, LeaveDays, MonthYear, LeaveID]
  );
  return result.affectedRows;
};


const getByUserIdAndMonth = async (userId, monthYear) => {
  const [rows] = await db.execute(
    `SELECT * FROM LeaveRecords WHERE UserID = ? AND MonthYear = ?`,
    [userId, monthYear]
  );
  return rows;
};

// ✅ Get leave records by MonthYear
const getByMonth = async (monthYear) => {
  const [rows] = await db.execute(
    `SELECT * FROM LeaveRecords WHERE MonthYear = ? ORDER BY CreatedAt DESC`,
    [monthYear]
  );
  return rows;
};

module.exports = { create, getAll, getByUserId, update, getByUserIdAndMonth, getByMonth, deleteLeave };
