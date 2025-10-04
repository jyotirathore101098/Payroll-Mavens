const db = require("../config/db");

// Create payroll base record
const create = async (data) => {
  const { UserID, BasicSalary, HRA = 0, DA = 0, OtherAllowance = 0 } = data;
  const [result] = await db.execute(
    `INSERT INTO PayrollBase (UserID, BasicSalary, HRA, DA, OtherAllowance) 
     VALUES (?, ?, ?, ?, ?)`,
    [UserID, BasicSalary, HRA, DA, OtherAllowance]
  );
  return result.insertId;
};

// Get all payroll base records
const getAll = async () => {
  const [rows] = await db.execute(`SELECT * FROM PayrollBase`);
  return rows;
};

// Get payroll base by UserID
const getByUserId = async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM PayrollBase WHERE UserID = ?`,
    [userId]
  );
  return rows[0];
};


// Update payroll base
const update = async (userId, data) => {
  const { BasicSalary = 0, HRA = 0, DA = 0, OtherAllowance = 0 } = data;
  await db.execute(
    `UPDATE PayrollBase 
     SET BasicSalary = ?, HRA = ?, DA = ?, OtherAllowance = ? 
     WHERE UserID = ?`,
    [BasicSalary, HRA, DA, OtherAllowance, userId]
  );
};

// Delete payroll base by UserID
const remove = async (userId) => {
  const [result] = await db.execute(
    `DELETE FROM PayrollBase WHERE UserID = ?`,
    [userId]
  );
  return result.affectedRows;
};

module.exports = { create, getAll, getByUserId, update, remove };
