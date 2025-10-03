
const db = require("../config/db");

const ComplianceModel = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ComplianceRules ORDER BY EffectiveFrom DESC");
    return rows;
  },

  getByName: async (name) => {
    const [rows] = await db.query("SELECT * FROM ComplianceRules WHERE Name = ? ORDER BY EffectiveFrom DESC", [name]);
    return rows;
  },

  create: async (rule) => {
    const { Name, Value, Description, EffectiveFrom } = rule;
    const [result] = await db.query(
      "INSERT INTO ComplianceRules (Name, Value, Description, EffectiveFrom) VALUES (?, ?, ?, ?)",
      [Name, Value, Description, EffectiveFrom]
    );
    return result.insertId;
  },

  update: async (id, rule) => {
    const { Name, Value, Description, EffectiveFrom } = rule;
    const [result] = await db.query(
      "UPDATE ComplianceRules SET Name=?, Value=?, Description=?, EffectiveFrom=? WHERE RuleID=?",
      [Name, Value, Description, EffectiveFrom, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM ComplianceRules WHERE RuleID = ?", [id]);
    return result.affectedRows;
  }
};

module.exports = ComplianceModel;
