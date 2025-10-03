// routes/complianceRoutes.js
const express = require("express");
const router = express.Router();
const ComplianceController = require("../controllers/complianceController");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

// HR/Admin can manage compliance rules
router.get("/", authenticateJWT, authorizeRoles("Admin", "HR"), ComplianceController.getAllRules);
router.post("/", authenticateJWT, authorizeRoles("Admin"), ComplianceController.createRule);
router.put("/:id", authenticateJWT, authorizeRoles("Admin"), ComplianceController.updateRule);
router.delete("/:id", authenticateJWT, authorizeRoles("Admin"), ComplianceController.deleteRule);

module.exports = router;
