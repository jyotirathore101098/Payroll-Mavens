// models/reportModel.js
const db = require("../config/db");

/**
 * Get totals for PF, ESI, TDS and count for a given MonthYear (e.g., "Sep-2025")
 */
async function getComplianceTotalsByMonth(monthYear) {
  const [rows] = await db.execute(
    `SELECT 
       COALESCE(SUM(PF),0)    AS totalPF,
       COALESCE(SUM(ESI),0)   AS totalESI,
       COALESCE(SUM(TDS),0)   AS totalTDS,
       COALESCE(SUM(GrossSalary),0) AS totalGross,
       COUNT(*)               AS runCount
     FROM PayrollRuns
     WHERE MonthYear = ?`,
    [monthYear]
  );
  return rows[0] || { totalPF: 0, totalESI: 0, totalTDS: 0, totalGross: 0, runCount: 0 };
}

/**
 * Per-user compliance rows for a month
 */
async function getComplianceByUser(monthYear) {
  const [rows] = await db.execute(
    `SELECT 
       pr.PayrollRunID,
       pr.UserID,
       u.Name,
       pr.GrossSalary,
       pr.PF,
       pr.ESI,
       pr.TDS,
       pr.NetSalary
     FROM PayrollRuns pr
     LEFT JOIN Users u ON u.UserID = pr.UserID
     WHERE pr.MonthYear = ?
     ORDER BY u.Name ASC`,
    [monthYear]
  );
  return rows;
}

/**
 * Optionally: range based totals (fromMonthYear,toMonthYear) if needed
 * (You can implement if MonthYear stored as 'YYYY-MM' or as a date; with 'Sep-2025' it's messy)
 */

module.exports = {
  getComplianceTotalsByMonth,
  getComplianceByUser,
};
