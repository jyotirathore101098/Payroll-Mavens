import React from "react";

const SalaryAdjustmentForm = ({ form, setForm, editId, setEditId, onAdd, onUpdate }) => {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCancel = () => {
    setEditId(null);
    setForm({ UserID: "", AdjustmentType: "", Amount: "", MonthYear: "", Remarks: "" });
  };

  return (
    <form
      className="salary-adjustment-form"
      onSubmit={editId ? onUpdate : onAdd}
    >
      <input name="UserID" value={form.UserID} onChange={handleChange} placeholder="User ID" required className="salary-adjustment-input" />
      <select name="AdjustmentType" value={form.AdjustmentType} onChange={handleChange} required className="salary-adjustment-input">
        <option value="">Type</option>
        <option value="Bonus">Bonus</option>
        <option value="Deduction">Deduction</option>
      </select>
      <input name="Amount" type="number" value={form.Amount} onChange={handleChange} placeholder="Amount" required className="salary-adjustment-input" />
      <input name="MonthYear" type="text" value={form.MonthYear} onChange={handleChange} placeholder="MonthYear (e.g. Oct-2025)" pattern="^[A-Za-z]{3}-\d{4}$" required className="salary-adjustment-input" />
      <input name="Remarks" value={form.Remarks} onChange={handleChange} placeholder="Remarks" className="salary-adjustment-input" />
      <button className="salary-adjustment-btn" type="submit">{editId ? "Update" : "Add"}</button>
      {editId && <button type="button" className="salary-adjustment-btn cancel" onClick={handleCancel}>Cancel</button>}
    </form>
  );
};

export default SalaryAdjustmentForm;
