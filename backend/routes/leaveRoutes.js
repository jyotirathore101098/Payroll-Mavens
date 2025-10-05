const express = require("express");
const router = express.Router();
const LeaveController = require("../controllers/leaveController");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");
// Get logged-in employee's own leaves
router.get(
  "/my",
  authenticateJWT,
  LeaveController.getOwnLeaves
);

//  Delete leave record (HR/Admin only)
router.delete(
  "/:LeaveID",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  LeaveController.deleteLeave
);

//  Create leave record
router.post(
  "/createLeave",
  authenticateJWT,
  authorizeRoles("HR", "Admin",  "Employee"),
  LeaveController.createLeave
);

//  Get all leaves (HR/Admin only)
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  LeaveController.getAllLeaves
);

//  Get user leaves
router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("HR", "Admin", "Employee"),
  LeaveController.getUserLeaves
);

//  Update leave record (HR/Admin correction)
router.put(
  "/:LeaveID",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  LeaveController.updateLeave
);

module.exports = router;
