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
const create = async ({ UserID, LeaveType, FromDate, ToDate, LeaveDays, Status = "Pending" }) => {
  const [result] = await db.execute(
    `INSERT INTO LeaveRecords (UserID, LeaveType, FromDate, ToDate, LeaveDays, Status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [UserID, LeaveType, FromDate, ToDate, LeaveDays, Status]
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
    `SELECT lr.*, u.Name AS UserName
FROM LeaveRecords lr
JOIN Users u ON lr.UserID = u.UserID
WHERE lr.UserID = ?
ORDER BY lr.CreatedAt DESC`,
    [UserID]
  );
  return rows;
};

// ✅ Update leave (HR/Admin can correct LeaveDays, LeaveType, Status)
const update = async (LeaveID, { LeaveType, FromDate, ToDate, LeaveDays, Status }) => {
  const [result] = await db.execute(
    `UPDATE LeaveRecords 
     SET LeaveType = ?, FromDate = ?, ToDate = ?, LeaveDays = ?, Status = ?
     WHERE LeaveID = ?`,
    [LeaveType, FromDate, ToDate, LeaveDays, Status, LeaveID]
  );
  return result.affectedRows;
};


// Get leave records by UserID and MonthYear (approved only)
const getByUserIdAndMonth = async (UserID, MonthYear) => {
  // MonthYear format: 'Oct-2025' (MMM-YYYY)
  // Extract month and year
  const [monthStr, yearStr] = MonthYear.split('-');
  const month = new Date(Date.parse(monthStr + " 1, 2020")).getMonth() + 1; // 1-indexed
  const year = parseInt(yearStr);
  // Find leaves where FromDate or ToDate falls within the month/year
  const [rows] = await db.execute(
    `SELECT * FROM LeaveRecords WHERE UserID = ? AND Status = 'Approved' AND (
      (MONTH(FromDate) = ? AND YEAR(FromDate) = ?)
      OR (MONTH(ToDate) = ? AND YEAR(ToDate) = ?)
    )`,
    [UserID, month, year, month, year]
  );
  return rows;
};

module.exports = { create, getAll, getByUserId, update, deleteLeave, getByUserIdAndMonth };
