const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

// New report endpoints
router.get("/payroll", authenticateJWT, authorizeRoles("Admin","HR"), reportController.getPayrollSummary);
router.get("/payslips", authenticateJWT, authorizeRoles("Admin","HR"), reportController.getPayslipReport);
router.get("/leaves", authenticateJWT, authorizeRoles("Admin","HR"), reportController.getLeaveReport);
router.get("/leaves/excel", authenticateJWT, authorizeRoles("Admin","HR"), reportController.exportLeaveExcel);
router.get("/adjustments", authenticateJWT, authorizeRoles("Admin","HR"), reportController.getSalaryAdjustmentReport);
router.get("/adjustments/csv", authenticateJWT, authorizeRoles("Admin","HR"), reportController.exportSalaryAdjustmentCsv);
router.get("/adjustments/excel", authenticateJWT, authorizeRoles("Admin","HR"), reportController.exportSalaryAdjustmentExcel);

// List available reports (for frontend)
router.get("/", authenticateJWT, authorizeRoles("Admin","HR"), reportController.listReports);

// Protected: Admin & HR only
router.get("/compliance", authenticateJWT, authorizeRoles("Admin","HR"), reportController.getComplianceReport);
router.get("/compliance/csv", authenticateJWT, authorizeRoles("Admin","HR"), reportController.exportComplianceCsv);

module.exports = router;
