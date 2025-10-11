
const path = require("path");
const fs = require("fs");
const Payslip = require("../models/payslipModel");
const Paysrollbase = require("../models/payrollBaseModel");
const PayrollRun = require("../models/payrollRunModel"); 
const leave = require("../models/leaveModel"); 
const salaryAdjustment = require("../models/salaryAdjustmentModel"); 
const pdfGenerator = require("../utils/pdfGenerator");
const PDFDocument = require("pdfkit");

//  Generate monthly payslip PDF
const generate = async (req, res) => {
  try {
    const { payrollRunId } = req.body;

    // 1. Get payroll run data
    const payroll = await PayrollRun.getById(payrollRunId);
    if (!payroll) return res.status(404).json({ error: "Payroll run not found" });

    // 2. Build file path
    const fileName = `payslip_${payroll.UserID}_${payroll.MonthYear}.pdf`;
    const filePath = path.join(process.env.PAYSLIP_DIR || "./payslips", fileName);

    // 3. Generate PDF file
    await pdfGenerator.generatePayslip(payroll, filePath);

    // 4. Save DB record
    const payslipId = await Payslip.create(payrollRunId, filePath);

    res.status(201).json({ message: "Payslip generated", payslipId, filePath });
  } catch (err) {
    console.error("Error generating payslip:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Fetch payslips for logged-in user
const getByUser = async (req, res) => {
  try {
    let payslips;
    // If Admin or HR, show all payslips
    if (req.user.role === "Admin" || req.user.role === "HR") {
      payslips = await Payslip.getAll();
    } else {
      payslips = await Payslip.getByUser(req.user.userId);
    }
    // Add downloadUrl for each payslip
    const payslipsWithUrl = payslips.map((p) => ({
      PayslipID: p.PayslipID,
      UserID: p.UserID,
      MonthYear: p.MonthYear,
      NetSalary: p.NetSalary,
      downloadUrl: `/api/payslips/download/${p.PayslipID}`,
    }));
    res.json(payslipsWithUrl);
  } catch (err) {
    console.error("Error fetching payslips:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
// Delete payslip by ID
const deletePayslip = async (req, res) => {
  try {
    const { id } = req.params;
    await Payslip.deleteById(id);
    res.json({ message: 'Payslip deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//  Download a payslip by ID
const download = async (req, res) => {
  try {
    const payslip = await Payslip.getById(req.params.id);
    if (!payslip) {
      console.error(`[download] Payslip not found for ID: ${req.params.id}`);
      return res.status(404).json({ error: "Payslip not found" });
    }

    const filePath = path.resolve(payslip.FilePath);
    if (!fs.existsSync(filePath)) {
      // Fallback: generate a valid payslip PDF with payroll run data
      const db = require("../config/db");
      
      // First, get payroll run data
      const [fallbackRows] = await db.query(
        `SELECT pr.*, u.Name, u.Email, u.Role 
         FROM PayrollRuns pr 
         LEFT JOIN Users u ON pr.UserID = u.UserID 
         WHERE pr.UserID = ? AND pr.MonthYear = ? 
         LIMIT 1`,
        [payslip.UserID, payslip.MonthYear]
      );
      
      let fallbackPayroll;
      if (fallbackRows.length > 0) {
        fallbackPayroll = fallbackRows[0];
      } else {
        // If no payroll run found, get user data directly
        const [userRows] = await db.query(
          `SELECT UserID, Name, Email, Role FROM Users WHERE UserID = ? LIMIT 1`,
          [payslip.UserID]
        );
        
        const userData = userRows[0] || {};
        fallbackPayroll = {
          UserID: payslip.UserID,
          MonthYear: payslip.MonthYear,
          GrossSalary: 0,
          PF: 0,
          ESI: 0,
          TDS: 0,
          NetSalary: payslip.NetSalary || 0,
          Name: userData.Name || 'Unknown Employee',
          Email: userData.Email || 'No Email Available',
          Role: userData.Role || 'Employee',
          Bonus: 0,
          Deduction: 0,
          LOPDays: 0,
          LOPDeduction: 0,
          TotalLeaves: 0,
          LeaveTypes: []
        };
      }
  // Generate PDF using payroll data
  let fallbackBuffers = [];
  const fallbackDoc = new PDFDocument();
      fallbackDoc.on('data', fallbackBuffers.push.bind(fallbackBuffers));
      fallbackDoc.on('end', () => {
        const pdfData = Buffer.concat(fallbackBuffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="missing_payslip_${payslip.PayslipID}.pdf"`);
        return res.status(200).send(pdfData);
      });
      // Add logo (blue clouds with INTMAVENS inside)
      const fallbackLogoPath = path.join(__dirname, "../assets/images.jpeg"); 
      if (fs.existsSync(fallbackLogoPath)) {
        fallbackDoc.image(fallbackLogoPath, fallbackDoc.page.width / 2 - 50, 30, { width: 100, align: "center" });
        fallbackDoc.moveDown(2);
        fallbackDoc.fontSize(20).font('Helvetica-Bold').fillColor('#0074D9').text("INTMAVENS", { align: "center" });
      } else {
        fallbackDoc.fontSize(20).font('Helvetica-Bold').text("INTMAVENS", { align: "center" });
      }
      fallbackDoc.moveDown();
      fallbackDoc.fontSize(16).text(`Payslip for ${fallbackPayroll.MonthYear}`, { align: "center" });
      fallbackDoc.moveDown();
      // Employee Info (always show all fields)
      fallbackDoc.fontSize(12).text(`Employee ID: ${fallbackPayroll.UserID}`);
      fallbackDoc.text(`Employee Name: ${fallbackPayroll.Name || 'Unknown Employee'}`);
      fallbackDoc.text(`Email: ${fallbackPayroll.Email || 'No Email Available'}`);
      fallbackDoc.text(`Role: ${fallbackPayroll.Role || 'Employee'}`);
      fallbackDoc.text(`Month-Year: ${fallbackPayroll.MonthYear}`);
      fallbackDoc.moveDown();
      // Earnings Section
      const fallbackFormatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;
      fallbackDoc.fontSize(14).font('Helvetica-Bold').text("EARNINGS");
      fallbackDoc.fontSize(12).font('Helvetica');
      fallbackDoc.text(`Gross Salary: ${fallbackFormatCurrency(fallbackPayroll.GrossSalary)}`);
      fallbackDoc.text(`Bonus: ${fallbackFormatCurrency(fallbackPayroll.Bonus)}`);
      fallbackDoc.moveDown();
    
      // Deductions Section
      fallbackDoc.fontSize(14).font('Helvetica-Bold').text("DEDUCTIONS");
      fallbackDoc.fontSize(12).font('Helvetica');
      fallbackDoc.text(`PF (12%): ${fallbackFormatCurrency(fallbackPayroll.PF)}`);
      fallbackDoc.text(`ESI (0.75%): ${fallbackFormatCurrency(fallbackPayroll.ESI)}`);
      fallbackDoc.text(`TDS (10%): ${fallbackFormatCurrency(fallbackPayroll.TDS)}`);
      fallbackDoc.text(`LOP Deduction: ${fallbackFormatCurrency(fallbackPayroll.LOPDeduction)}`);
      fallbackDoc.text(`Other Deductions: ${fallbackFormatCurrency(fallbackPayroll.Deduction)}`);
      fallbackDoc.moveDown();
      // Net Salary (Highlighted)
      fallbackDoc.fontSize(16).font('Helvetica-Bold').text(`NET SALARY: ${fallbackFormatCurrency(fallbackPayroll.NetSalary)}`);
      fallbackDoc.moveDown();
      // Footer
      fallbackDoc.text("This is a system-generated payslip.", { align: "center" });
      fallbackDoc.text("(Original payslip file is missing)", { align: "center" });
      fallbackDoc.end();
      return;

    }

    res.download(filePath);
  } catch (err) {
    console.error(`[download] Error downloading payslip:`, err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { generate, getByUser, download, deletePayslip };
