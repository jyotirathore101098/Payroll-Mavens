
const ComplianceModel = require("../models/complianceModel");

const ComplianceController = {
  getAllRules: async (req, res) => {
    try {
      const rules = await ComplianceModel.getAll();
      res.json(rules);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createRule: async (req, res) => {
    try {
      const id = await ComplianceModel.create(req.body);
      res.status(201).json({ message: "Rule created", RuleID: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateRule: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await ComplianceModel.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "Rule not found" });
      res.json({ message: "Rule updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteRule: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ComplianceModel.delete(id);
      if (!deleted) return res.status(404).json({ message: "Rule not found" });
      res.json({ message: "Rule deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ComplianceController;
