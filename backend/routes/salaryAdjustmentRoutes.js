const express = require("express");
const router = express.Router();
const AdjustmentController = require("../controllers/salaryAdjustmentController");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

// Create adjustment
router.post(
  "/",
    authenticateJWT,
  authorizeRoles("HR", "Admin"),
  AdjustmentController.createAdjustment
);

// Get all adjustments
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  AdjustmentController.getAllAdjustments
);

// Get user adjustments
router.get(
  "/:userId",
  authenticateJWT,
  authorizeRoles("HR", "Admin", "Employee"),
  AdjustmentController.getUserAdjustments
);

//  Update adjustment
router.put(
  "/:AdjustmentID",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  AdjustmentController.updateAdjustment
);

//  Delete adjustment
router.delete(
  "/:AdjustmentID",
  authenticateJWT,
  authorizeRoles("HR", "Admin"),
  AdjustmentController.deleteAdjustment
);

module.exports = router;

