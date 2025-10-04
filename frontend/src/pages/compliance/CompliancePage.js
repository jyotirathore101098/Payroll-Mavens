import React, { useEffect, useState } from "react";
import { fetchComplianceRules, addComplianceRule, updateComplianceRule, deleteComplianceRule } from "./complianceService";
import ComplianceForm from "./ComplianceForm";
import ComplianceTable from "./ComplianceTable";
import "./CompliancePage.css";

const CompliancePage = () => {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({ Name: "", Value: "", Description: "", EffectiveFrom: "" });
  const [editId, setEditId] = useState(null);

  const loadRules = async () => {
    try {
      const data = await fetchComplianceRules();
      setRules(data);
    } catch {
      alert("Failed to fetch compliance rules");
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleAdd = async () => {
    await addComplianceRule(form);
    setForm({ Name: "", Value: "", Description: "", EffectiveFrom: "" });
    loadRules();
  };

  const handleUpdate = async () => {
    await updateComplianceRule(editId, form);
    setEditId(null);
    setForm({ Name: "", Value: "", Description: "", EffectiveFrom: "" });
    loadRules();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this compliance rule?")) return;
    await deleteComplianceRule(id);
    loadRules();
  };

  const handleEdit = (rule) => {
    setEditId(rule.RuleID);
    setForm({
      Name: rule.Name,
      Value: rule.Value,
      Description: rule.Description,
      EffectiveFrom: rule.EffectiveFrom ? rule.EffectiveFrom.slice(0, 10) : "",
    });
  };

  return (
    <div className="compliance-container">
      <h2 className="compliance-title">Compliance Rules Management</h2>
      <ComplianceForm
        form={form}
        setForm={setForm}
        editId={editId}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onCancel={() => {
          setEditId(null);
          setForm({ Name: "", Value: "", Description: "", EffectiveFrom: "" });
        }}
      />
      <ComplianceTable rules={rules} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default CompliancePage;
