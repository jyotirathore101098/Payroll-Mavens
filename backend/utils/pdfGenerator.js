const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Currency formatter
const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

const generatePayslip = async (payroll, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      // ✅ Ensure directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text("INTMAVENS", { align: "center" });
      doc.moveDown();

      doc.fontSize(16).text(`Payslip for ${payroll.MonthYear}`, { align: "center" });
      doc.moveDown();

      // Employee Info
      doc.fontSize(12).text(`Employee ID: ${payroll.UserID}`);
      if (payroll.Name) doc.text(`Employee Name: ${payroll.Name}`);
      if (payroll.Email) doc.text(`Email: ${payroll.Email}`);
      doc.text(`Month-Year: ${payroll.MonthYear}`);
      doc.moveDown();

      // Earnings Section
      doc.fontSize(14).font('Helvetica-Bold').text("EARNINGS");
      doc.fontSize(12).font('Helvetica');
      doc.text(`Gross Salary: ${formatCurrency(payroll.GrossSalary)}`);
      if (payroll.Bonus && payroll.Bonus > 0) {
        doc.text(`Bonus: ${formatCurrency(payroll.Bonus)}`);
      }
      doc.moveDown();

      
      // Deductions Section
      doc.fontSize(14).font('Helvetica-Bold').text("DEDUCTIONS");
      doc.fontSize(12).font('Helvetica');
      doc.text(`PF (12%): ${formatCurrency(payroll.PF)}`);
      doc.text(`ESI (0.75%): ${formatCurrency(payroll.ESI)}`);
      doc.text(`TDS (10%): ${formatCurrency(payroll.TDS)}`);
      if (payroll.LOPDeduction && payroll.LOPDeduction > 0) {
        doc.text(`LOP Deduction: ${formatCurrency(payroll.LOPDeduction)}`);
      }
      if (payroll.Deduction && payroll.Deduction > 0) {
        doc.text(`Other Deductions: ${formatCurrency(payroll.Deduction)}`);
      }
      doc.moveDown();

      // Net Salary (Highlighted)
      doc.fontSize(16).font('Helvetica-Bold').text(`NET SALARY: ${formatCurrency(payroll.NetSalary)}`);
      doc.moveDown();

      // Footer
      doc.text("This is a system-generated payslip.", { align: "center" });

      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
      doc.on("error", reject); // catch PDFKit errors
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generatePayslip };
