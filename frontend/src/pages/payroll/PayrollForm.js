import React from "react";
import "./PayrollPage.css";

const PayrollForm = ({ form, editId, onChange, onSubmit, onCancel }) => {
  return (
    <form className="payroll-form" onSubmit={onSubmit}>
      <input
        name="UserID"
        value={form.UserID}
        onChange={onChange}
        placeholder="User ID"
        required
        className="payroll-input"
        type="text"
      />
      <input
        name="BasicSalary"
        value={form.BasicSalary}
        onChange={onChange}
        placeholder="Basic Salary (₹)"
        required
        className="payroll-input"
        type="number"
        min="0"
        step="0.01"
      />
      <input
        name="HRA"
        value={form.HRA}
        onChange={onChange}
        placeholder="HRA (₹)"
        className="payroll-input"
        type="number"
        min="0"
        step="0.01"
      />
      <input
        name="DA"
        value={form.DA}
        onChange={onChange}
        placeholder="DA (₹)"
        className="payroll-input"
        type="number"
        min="0"
        step="0.01"
      />
      <input
        name="OtherAllowance"
        value={form.OtherAllowance}
        onChange={onChange}
        placeholder="Other Allowance (₹)"
        className="payroll-input"
        type="number"
        min="0"
        step="0.01"
      />

      <div className="form-buttons">
        <button className="payroll-btn" type="submit">
          {editId ? "Update Payroll" : "Add Payroll"}
        </button>

        {editId && (
          <button
            className="payroll-btn cancel"
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

export default PayrollForm;
