const PayrollBase = require("../models/payrollBaseModel");
const SalaryAdjustment = require("../models/salaryAdjustmentModel");
const Leave = require("../models/leaveModel");
const PayrollRun = require("../models/payrollRunModel");

// Trigger payroll run
const runPayroll = async (req, res) => {
  try {
    const { UserID, MonthYear } = req.body;

    // 1. Get base salary
    const base = await PayrollBase.getByUserId(UserID);
    if (!base) {
      console.error(`[runPayroll] Payroll base not found for UserID: ${UserID}`);
      return res.status(404).json({ message: "Payroll base not found" });
    }

  // Ensure all components are numbers to prevent string concatenation
  const basic = Number(base.BasicSalary) || 0;
  const hra = Number(base.HRA) || 0;
  const da = Number(base.DA) || 0;
  const other = Number(base.OtherAllowance) || 0;
  let grossSalary = basic + hra + da + other;
    console.log(`[runPayroll] Base salary for UserID ${UserID}:`, grossSalary);

    // 2. Calculate leave information
    const leaves = await Leave.getByUserIdAndMonth(UserID, MonthYear);
    const lop = leaves
      .filter((l) => l.LeaveType === "LOP")
      .reduce((sum, l) => sum + l.LeaveDays, 0);
    const totalLeaves = leaves.reduce((sum, l) => sum + l.LeaveDays, 0);
    const leaveTypes = [...new Set(leaves.map(l => l.LeaveType))]; // Get unique leave types
    const lopDeduction = +(lop * (grossSalary / 30)).toFixed(2);
    console.log(`[runPayroll] LOP days for UserID ${UserID}, MonthYear ${MonthYear}:`, lop);
    console.log(`[runPayroll] Total leaves for UserID ${UserID}, MonthYear ${MonthYear}:`, totalLeaves);
    console.log(`[runPayroll] Leave types for UserID ${UserID}, MonthYear ${MonthYear}:`, leaveTypes);

    grossSalary -= lopDeduction;
    console.log(`[runPayroll] Gross salary after LOP:`, grossSalary);

    // 3. Apply salary adjustments
    // Fetch bonus and deduction directly from DB using aggregation
    const db = require('../config/db');
    const [[bonusRow]] = await db.execute(
      `SELECT COALESCE(SUM(Amount),0) AS Bonus FROM SalaryAdjustments WHERE UserID = ? AND MonthYear = ? AND AdjustmentType = 'Bonus'`,
      [UserID, MonthYear]
    );
    const [[deductionRow]] = await db.execute(
      `SELECT COALESCE(SUM(Amount),0) AS Deduction FROM SalaryAdjustments WHERE UserID = ? AND MonthYear = ? AND AdjustmentType = 'Deduction'`,
      [UserID, MonthYear]
    );
    const bonus = Number(bonusRow.Bonus) || 0;
    const deduction = Number(deductionRow.Deduction) || 0;
  // 4. Calculate Adjusted Gross Salary
  const adjustedGross = grossSalary + bonus - deduction;
  console.log(`[runPayroll] Adjusted gross salary after bonus/deduction:`, adjustedGross);

  // 5. Calculate deductions on adjusted gross

  const [[pfRule]] = await db.execute(
    `SELECT Value FROM ComplianceRules 
     WHERE Name = 'PF' AND EffectiveFrom <= CURDATE() 
     ORDER BY EffectiveFrom DESC LIMIT 1`
  );
  const [[esiRule]] = await db.execute(
    `SELECT Value FROM ComplianceRules 
     WHERE Name = 'ESI' AND EffectiveFrom <= CURDATE() 
     ORDER BY EffectiveFrom DESC LIMIT 1`
  );
  const [[tdsRule]] = await db.execute(
    `SELECT Value FROM ComplianceRules 
     WHERE Name = 'TDS' AND EffectiveFrom <= CURDATE() 
     ORDER BY EffectiveFrom DESC LIMIT 1`
  );

  const pfRate = pfRule?.Value || 0.12;     // fallback to 12%
  const esiRate = esiRule?.Value || 0.0075; // fallback to 0.75%
  const tdsRate = tdsRule?.Value || 0.1;    // fallback to 10%

console.log(pfRate,esiRate,tdsRate);

  const PF = +Number(adjustedGross * pfRate).toFixed(2);
  const ESI = +Number(adjustedGross * esiRate).toFixed(2);
  const TDS = +Number(adjustedGross * tdsRate).toFixed(2);
  console.log(`[runPayroll] Deductions PF: ${PF}, ESI: ${ESI}, TDS: ${TDS}`);

  // 6. Net salary: adjusted gross - PF - ESI - TDS
  const netSalary = Number(adjustedGross - PF - ESI - TDS);
  console.log(`[runPayroll] Net salary:`, netSalary);

    // 5. Save payroll run
    const payrollRunId = await PayrollRun.createPayrollRun({
      UserID,
      MonthYear,
      GrossSalary: grossSalary,
      PF,
      ESI,
      TDS,
      NetSalary: netSalary,
      Bonus: bonus,
      Deduction: deduction
    });
    console.log(`[runPayroll] Payroll run saved with ID:`, payrollRunId);

    // Build SalaryAdjustment string
    let adjustmentStr = '';
    if (bonus) adjustmentStr += `+${bonus}`;
    if (deduction) adjustmentStr += (adjustmentStr ? ' ' : '') + `-${deduction}`;

    res.status(201).json({
      message: "Payroll run completed",
      PayrollRunID: payrollRunId,
      UserID,
      MonthYear,
      GrossSalary: grossSalary,
      PF,
      ESI,
      TDS,
      NetSalary: netSalary,
      LOPDays: lop,
      LOPDeduction: lopDeduction,
      TotalLeaves: totalLeaves,
      LeaveTypes: leaveTypes,
      Bonus: bonus,
      Deduction: deduction,
      SalaryAdjustment: adjustmentStr
    });
  } catch (err) {
    console.error("Error running payroll:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// View payroll runs (all for Admin, own for others)
const getAll = async (req, res) => {
  try {
    let runs;
    if (req.user.role === "Admin"|| req.user.role === "HR") {
      runs = await PayrollRun.getAllPayrollRuns();
    } else {
      runs = await PayrollRun.getPayrollRunsByUser(req.user.userId);
    }
    // For each payroll run, fetch salary adjustment details
    const SalaryAdjustment = require("../models/salaryAdjustmentModel");
    const runsWithAdjustments = await Promise.all(runs.map(async (run) => {
      const adjustments = await SalaryAdjustment.getByUserIdAndMonth(run.UserID, run.MonthYear);
      let bonus = 0;
      let deduction = 0;
      adjustments.forEach((adj) => {
        if (adj.AdjustmentType === "Bonus") bonus += adj.Amount;
        else if (adj.AdjustmentType === "Deduction") deduction += adj.Amount;
      });
      let adjustmentStr = '';
      if (bonus) adjustmentStr += `+${bonus}`;
      if (deduction) adjustmentStr += (adjustmentStr ? ' ' : '') + `-${deduction}`;
      return { ...run, SalaryAdjustment: adjustmentStr, Bonus: bonus, Deduction: deduction };
    }));
    res.json(runsWithAdjustments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// View payroll runs for a user
const getByUser = async (req, res) => {
  try {
    const runs = await PayrollRun.getPayrollRunsByUser(req.params.userId);
    // For each payroll run, fetch salary adjustment details
    const SalaryAdjustment = require("../models/salaryAdjustmentModel");
    const runsWithAdjustments = await Promise.all(runs.map(async (run) => {
      const adjustments = await SalaryAdjustment.getByUserIdAndMonth(run.UserID, run.MonthYear);
      let bonus = 0;
      let deduction = 0;
      adjustments.forEach((adj) => {
        if (adj.AdjustmentType === "Bonus") bonus += adj.Amount;
        else if (adj.AdjustmentType === "Deduction") deduction += adj.Amount;
      });
      let adjustmentStr = '';
      if (bonus) adjustmentStr += `+${bonus}`;
      if (deduction) adjustmentStr += (adjustmentStr ? ' ' : '') + `-${deduction}`;
      return { ...run, SalaryAdjustment: adjustmentStr, Bonus: bonus, Deduction: deduction };
    }));
    res.json(runsWithAdjustments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete payroll run by ID
const deletePayrollRun = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if payroll run exists
    const existingRun = await PayrollRun.getById(id);
    if (!existingRun) {
      return res.status(404).json({ message: "Payroll run not found" });
    }
    
    // Delete the payroll run
    await PayrollRun.deleteById(id);
    
    res.json({ message: "Payroll run deleted successfully" });
  } catch (err) {
    console.error("Error deleting payroll run:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { runPayroll, getAll, getByUser, deletePayrollRun };
