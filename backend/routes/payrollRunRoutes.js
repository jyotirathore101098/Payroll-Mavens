const express = require("express");
const router = express.Router();
const PayrollRunController = require("../controllers/payrollRunController");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

// Run payroll (HR/Admin only)
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  PayrollRunController.runPayroll
);

// Get payroll runs (all for Admin, own for others)
router.get(
  "/",
  authenticateJWT,
  PayrollRunController.getAll
);

// Get payroll runs by user (HR/Admin)
router.get(
  "/:userId",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  PayrollRunController.getByUser
);

// Delete payroll run (HR/Admin only)
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  PayrollRunController.deletePayrollRun
);

module.exports = router;
