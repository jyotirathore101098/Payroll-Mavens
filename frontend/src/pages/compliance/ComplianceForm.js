import React from "react";

const ComplianceForm = ({ form, setForm, editId, onAdd, onUpdate, onCancel }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) onUpdate();
    else onAdd();
  };

  return (
    <form className="compliance-form" onSubmit={handleSubmit}>
      <input
        name="Name"
        value={form.Name}
        onChange={handleChange}
        placeholder="Rule Name (e.g., PF, ESI)"
        required
        className="compliance-input"
        type="text"
      />
      <input
        name="Value"
        type="number"
        step="0.0001"
        min="0"
        value={form.Value}
        onChange={handleChange}
        placeholder="Value (0.12 for 12% or 500 for fixed)"
        required
        className="compliance-input"
      />
      <input
        name="Description"
        value={form.Description}
        onChange={handleChange}
        placeholder="Description of the rule"
        className="compliance-input"
        type="text"
      />
      <input
        name="EffectiveFrom"
        type="date"
        value={form.EffectiveFrom}
        onChange={handleChange}
        required
        className="compliance-input"
        title="Effective date for this compliance rule"
      />
      
      <div className="form-buttons">
        <button className="compliance-btn" type="submit">
          {editId ? "Update Rule" : "Add Rule"}
        </button>
        {editId && (
          <button 
            className="compliance-btn cancel" 
            type="button" 
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ComplianceForm;
