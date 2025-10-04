
const express = require("express");
const router = express.Router();
const PayrollController = require("../controllers/payrollController");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

// Create payroll base
router.post(
  "/create",
  authenticateJWT,
  authorizeRoles("Admin", "HR"),
  PayrollController.create
);

// Get all payroll base
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "HR"),
  PayrollController.getAll
);

// Get payroll base by userId
router.get(
  "/:userId",
  authenticateJWT, 
  authorizeRoles("Admin", "HR"),
  PayrollController.getByUserId
);

// Update payroll base
router.put(
  "/:userId",
  authenticateJWT,
  authorizeRoles("Admin", "HR"),
  PayrollController.update
);

// Delete payroll base
router.delete(
  "/:userId",
  authenticateJWT,
  authorizeRoles("Admin", "HR"),
  PayrollController.remove
);

module.exports = router;
