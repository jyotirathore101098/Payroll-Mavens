const express = require("express");
const router = express.Router();
const payslipController = require("../controllers/payslipController");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

// Delete payslip by ID (HR/Admin only)
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('HR', 'Admin'),
  payslipController.deletePayslip
);

//  Generate payslip (HR/Admin only)
router.post(
  "/generate",
  authenticateJWT,
  // authorizeRoles("Admin", "HR",""),
  payslipController.generate
);

// Fetch logged-in user's payslips (Employee/HR/Admin)
router.get(
  "/my",
  authenticateJWT,
  payslipController.getByUser
);

//  Download a payslip by ID
router.get(
  "/download/:id",
  authenticateJWT,
  payslipController.download
);

//  Download PDF by payslip ID (alternative endpoint)
router.get(
  "/:id/pdf",
  authenticateJWT,
  payslipController.download
);

// Utility: Generate payslips for all payroll runs (Admin/HR only)
const PayrollRun = require('../models/payrollRunModel');
router.post(
  '/generate-all',
  authenticateJWT,
  authorizeRoles('Admin', 'HR'),
  async (req, res) => {
    try {
      const runs = await PayrollRun.getAllPayrollRuns();
      let results = [];
      for (const run of runs) {
        try {
          // Call the same logic as /generate
          const fileName = `payslip_${run.UserID}_${run.MonthYear}.pdf`;
          const filePath = require('path').join(process.env.PAYSLIP_DIR || './payslips', fileName);
          await require('../utils/pdfGenerator').generatePayslip(run, filePath);
          await require('../models/payslipModel').create(run.PayrollRunID, filePath);
          results.push({ PayrollRunID: run.PayrollRunID, status: 'success', filePath });
        } catch (err) {
          results.push({ PayrollRunID: run.PayrollRunID, status: 'error', error: err.message });
        }
      }
      res.json({ message: 'Payslip generation complete', results });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate payslips', details: err.message });
    }
  }
);
module.exports = router;

