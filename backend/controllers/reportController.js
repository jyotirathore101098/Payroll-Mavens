// List available reports (for frontend)
function listReports(req, res) {
  // This can be static or dynamic. For now, return static list.
  res.json([
    {
      id: "compliance",
      name: "Compliance Report",
      endpoint: "/api/reports/compliance",
      description: "Statutory compliance summary and breakdown by user."
    },
    {
      id: "payroll_summary",
      name: "Payroll Summary Report",
      endpoint: "/api/reports/payroll",
      description: "Monthly payroll totals, gross/net salary, allowances, deductions for all employees."
    },
    {
      id: "payslip",
      name: "Payslip Report",
      endpoint: "/api/reports/payslips",
      description: "List of generated payslips for each user, with download links."
    },
    {
      id: "leave",
      name: "Leave Report",
      endpoint: "/api/reports/leaves",
      description: "Leave records summary by type, user, and month."
    },
    {
      id: "salary_adjustment",
      name: "Salary Adjustment Report",
      endpoint: "/api/reports/adjustments",
      description: "List and summary of all salary adjustments (bonuses, deductions) by user and month."
    }
  ]);
}

// Placeholder endpoints for new report types
async function getPayrollSummary(req, res) {
  res.json({ message: "Payroll summary report endpoint not yet implemented." });
}

async function getPayslipReport(req, res) {
  // Example: fetch payslips for all users (Admin/HR)
  const PayslipModel = require("../models/payslipModel");
  try {
    // For demo, fetch all payslips (in real app, filter by user/role)
    const payslips = await PayslipModel.getAll();
    // Return payslip info with download endpoint
    res.json(payslips.map(slip => ({
      PayslipID: slip.PayslipID,
      UserID: slip.UserID,
      MonthYear: slip.MonthYear,
      NetSalary: slip.NetSalary,
      FilePath: slip.FilePath,
      downloadUrl: `/api/payslips/download/${slip.PayslipID}`
    })));
  } catch (err) {
    res.status(500).json({ message: "Error fetching payslips", error: err.message });
  }
}

/**
 * GET /api/reports/leaves/csv?month=Sep-2025
 * Returns CSV download of leave info for the month
 */
async function exportLeaveCsv(req, res) {
  try {
    const month = req.query.month;
    const LeaveModel = require('../models/leaveModel');
    let rows;
    let filename;
    if (month) {
      rows = await LeaveModel.getByMonth(month);
      filename = `leave_${month}.csv`;
    } else {
      rows = await LeaveModel.getAll();
      filename = `leave_all.csv`;
    }

    // Build CSV header
    const header = [
      "LeaveID",
      "UserID",
      "LeaveType",
      "LeaveDays",
      "MonthYear"
    ];
    const csvRows = [header.join(",")];

    for (const r of rows) {
      const line = [
        r.LeaveID,
        r.UserID,
        r.LeaveType,
        r.LeaveDays,
        r.MonthYear
      ].join(",");
      csvRows.push(line);
    }

    const csv = csvRows.join("\n");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    console.error("Leave CSV export error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getLeaveReport(req, res) {
  try {
    const LeaveModel = require('../models/leaveModel');
    const rows = await LeaveModel.getAll();
    // Match CSV columns
    const leaves = rows.map(r => ({
      LeaveID: r.LeaveID,
      UserID: r.UserID,
      LeaveType: r.LeaveType,
      LeaveDays: r.LeaveDays,
      MonthYear: r.MonthYear,
      CreatedAt: r.CreatedAt
    }));
    res.json(leaves);
  } catch (err) {
    console.error("Leave report error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getSalaryAdjustmentReport(req, res) {
  res.json({ message: "Salary adjustment report endpoint not yet implemented." });
}
// controllers/reportController.js
const ReportModel = require("../models/reportModel");

/**
 * GET /api/reports/compliance?month=Sep-2025
 * Returns JSON summary + per-user breakdown
 */
async function getComplianceReport(req, res) {
  try {
    const month = req.query.month;
    if (!month) return res.status(400).json({ message: "Query param 'month' required (e.g., Sep-2025)" });

    const totals = await ReportModel.getComplianceTotalsByMonth(month);
    const perUser = await ReportModel.getComplianceByUser(month);

    res.json({
      month,
      totals,
      perUser,
    });
  } catch (err) {
    console.error("Compliance report error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/reports/compliance/csv?month=Sep-2025
 * Returns CSV download (per-user breakdown)
 */
async function exportComplianceCsv(req, res) {
  try {
    const month = req.query.month;
    if (!month) return res.status(400).json({ message: "Query param 'month' required (e.g., Sep-2025)" });

    const rows = await ReportModel.getComplianceByUser(month);

    // Build CSV header
    const header = [
      "PayrollRunID",
      "UserID",
      "Name",
      "GrossSalary",
      "PF",
      "ESI",
      "TDS",
      "NetSalary",
    ];
    const csvRows = [header.join(",")];

    // Build CSV lines safely (escape commas & quotes)
    for (const r of rows) {
      const line = [
        r.PayrollRunID,
        r.UserID,
        `"${String(r.Name || "").replace(/"/g, '""')}"`,
        Number(r.GrossSalary || 0).toFixed(2),
        Number(r.PF || 0).toFixed(2),
        Number(r.ESI || 0).toFixed(2),
        Number(r.TDS || 0).toFixed(2),
        Number(r.NetSalary || 0).toFixed(2),
      ].join(",");
      csvRows.push(line);
    }

    const csv = csvRows.join("\n");

    res.setHeader("Content-Disposition", `attachment; filename="compliance_${month}.csv"`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    console.error("Compliance CSV export error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getComplianceReport,
  exportComplianceCsv,
  listReports,
  getPayrollSummary,
  getPayslipReport,
  getLeaveReport,
  exportLeaveCsv,
  getSalaryAdjustmentReport,
};
