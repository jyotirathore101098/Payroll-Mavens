// src/pages/PayrollRunPage/PayrollRunForm.js
import React from "react";

const PayrollRunForm = ({ form, loading, previewLoading, onChange, onSubmit, onPreview }) => {
  return (
    <form className="payrollrun-form" onSubmit={onSubmit}>
      <input
        name="UserID"
        value={form.UserID}
        onChange={onChange}
        placeholder="User ID"
        type="text"
        required
        className="payrollrun-input"
      />
      <input
        name="MonthYear"
        value={form.MonthYear}
        onChange={onChange}
        placeholder="Month-Year (e.g., Oct-2025)"
        pattern="[A-Za-z]{3}-[0-9]{4}"
        title="Format: MMM-YYYY (e.g., Oct-2025)"
        required
        className="payrollrun-input"
      />
      
      <div className="form-buttons">
        <button 
          className="payrollrun-btn" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Generate Payroll Run'}
        </button>
        <button 
          className="payrollrun-btn preview" 
          type="button" 
          onClick={onPreview} 
          disabled={previewLoading}
        >
          {previewLoading ? 'Loading...' : 'Preview Calculation'}
        </button>
      </div>
    </form>
  );
};

export default PayrollRunForm;
