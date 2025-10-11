// Utility functions for common operations
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const generateMonthYear = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month}-${year}`;
};

const escapeCsvValue = (value) => {
  return `"${String(value || "").replace(/"/g, '""')}"`;
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toFixed(2);
};

const generateCsvResponse = (csvRows, filename, res) => {
  const csv = csvRows.join("\n");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
};

const generateExcelResponse = (data, worksheetName, filename, columnWidths, res) => {
  const XLSX = require('xlsx');
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = columnWidths;
  XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(excelBuffer);
};

function listReports(req, res) {
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


async function getPayrollSummary(req, res) {
  res.json({ message: "Payroll summary report endpoint not yet implemented." });
}

async function getPayslipReport(req, res) {
  //  fetch payslips for all users (Admin/HR)
  const PayslipModel = require("../models/payslipModel");
  try {
    // fetch all payslips 
    const payslips = await PayslipModel.getAll();
   
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

async function exportLeaveCsv(req, res) {
  try {
    const { month } = req.query;
    const LeaveModel = require('../models/leaveModel');
    
    const rows = month ? await LeaveModel.getByMonth(month) : await LeaveModel.getAll();
    const filename = month ? `leave_${month}.csv` : 'leave_all.csv';

    const header = ["LeaveID", "UserID", "UserName", "LeaveType", "FromDate", "ToDate", "LeaveDays", "MonthYear", "Status", "CreatedAt"];
    const csvRows = [header.join(",")];

    csvRows.push(...rows.map(r => [
      r.LeaveID,
      r.UserID,
      escapeCsvValue(r.UserName || r.Name),
      r.LeaveType,
      formatDate(r.FromDate),
      formatDate(r.ToDate),
      r.LeaveDays,
      generateMonthYear(r.FromDate),
      r.Status,
      formatDate(r.CreatedAt)
    ].join(",")));

    generateCsvResponse(csvRows, filename, res);
  } catch (err) {
    console.error("Leave CSV export error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getLeaveReport(req, res) {
  try {
    const LeaveModel = require('../models/leaveModel');
    const rows = await LeaveModel.getAll();

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

async function exportLeaveExcel(req, res) {
  try {
    const { month } = req.query;
    const LeaveModel = require('../models/leaveModel');
    
    const rows = month ? await LeaveModel.getByMonth(month) : await LeaveModel.getAll();
    const filename = month ? `leaves_${month}.xlsx` : 'leaves_all.xlsx';

    const excelData = rows.map(r => ({
      'Leave ID': r.LeaveID,
      'User ID': r.UserID,
      'User Name': r.UserName || r.Name || '',
      'Leave Type': r.LeaveType || '',
      'From Date': formatDate(r.FromDate),
      'To Date': formatDate(r.ToDate),
      'Leave Days': Number(r.LeaveDays || 0),
      'Month Year': generateMonthYear(r.FromDate),
      'Status': r.Status || '',
      'Created At': formatDate(r.CreatedAt)
    }));

    const columnWidths = [
      { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 12 },
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 15 }
    ];

    generateExcelResponse(excelData, 'Leaves', filename, columnWidths, res);
  } catch (err) {
    console.error("Leave Excel export error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getSalaryAdjustmentReport(req, res) {
  try {
    const SalaryAdjustmentModel = require('../models/salaryAdjustmentModel');
    const adjustments = await SalaryAdjustmentModel.getAll();
    
    // Format the data to match frontend expectations
    const formattedAdjustments = adjustments.map(adjustment => ({
      AdjustmentID: adjustment.AdjustmentID,
      UserID: adjustment.UserID,
      Amount: adjustment.Amount,
      Reason: adjustment.AdjustmentType, 
      MonthYear: adjustment.MonthYear,
      CreatedAt: adjustment.CreatedAt,
      Name: adjustment.Name 
    }));
    
    res.json(formattedAdjustments);
  } catch (err) {
    console.error("Salary adjustment report error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function exportSalaryAdjustmentCsv(req, res) {
  try {
    const { month } = req.query;
    const SalaryAdjustmentModel = require('../models/salaryAdjustmentModel');
    
    const allRows = await SalaryAdjustmentModel.getAll();
    const rows = month ? allRows.filter(row => row.MonthYear === month) : allRows;
    const filename = month ? `salary_adjustments_${month}.csv` : 'salary_adjustments_all.csv';

    const header = ["AdjustmentID", "UserID", "Name", "AdjustmentType", "Amount", "MonthYear", "CreatedAt"];
    const csvRows = [header.join(",")];

    csvRows.push(...rows.map(r => [
      r.AdjustmentID,
      r.UserID,
      escapeCsvValue(r.Name),
      escapeCsvValue(r.AdjustmentType),
      formatCurrency(r.Amount),
      r.MonthYear,
      formatDate(r.CreatedAt)
    ].join(",")));

    generateCsvResponse(csvRows, filename, res);
  } catch (err) {
    console.error("Salary adjustment CSV export error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function exportSalaryAdjustmentExcel(req, res) {
  try {
    const { month } = req.query;
    const SalaryAdjustmentModel = require('../models/salaryAdjustmentModel');
    
    const allRows = await SalaryAdjustmentModel.getAll();
    const rows = month ? allRows.filter(row => row.MonthYear === month) : allRows;
    const filename = month ? `salary_adjustments_${month}.xlsx` : 'salary_adjustments_all.xlsx';

    const excelData = rows.map(r => ({
      'Adjustment ID': r.AdjustmentID,
      'User ID': r.UserID,
      'Name': r.Name || '',
      'Adjustment Type': r.AdjustmentType || '',
      'Amount': Number(r.Amount || 0),
      'Month Year': r.MonthYear,
      'Created At': formatDate(r.CreatedAt)
    }));

    const columnWidths = [
      { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 20 }
    ];

    generateExcelResponse(excelData, 'Salary Adjustments', filename, columnWidths, res);
  } catch (err) {
    console.error("Salary adjustment Excel export error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

const ReportModel = require("../models/reportModel");

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

  // Returns CSV download (per-user breakdown)
 
async function exportComplianceCsv(req, res) {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ message: "Query param 'month' required (e.g., Sep-2025)" });

    const rows = await ReportModel.getComplianceByUser(month);
    const header = ["PayrollRunID", "UserID", "Name", "GrossSalary", "PF", "ESI", "TDS", "NetSalary"];
    const csvRows = [header.join(",")];

    csvRows.push(...rows.map(r => [
      r.PayrollRunID,
      r.UserID,
      escapeCsvValue(r.Name),
      formatCurrency(r.GrossSalary),
      formatCurrency(r.PF),
      formatCurrency(r.ESI),
      formatCurrency(r.TDS),
      formatCurrency(r.NetSalary)
    ].join(",")));

    generateCsvResponse(csvRows, `compliance_${month}.csv`, res);
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
  exportLeaveExcel,
  getSalaryAdjustmentReport,
  exportSalaryAdjustmentCsv,
  exportSalaryAdjustmentExcel,
};
