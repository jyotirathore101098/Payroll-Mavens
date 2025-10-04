import React, { useState } from "react";

const PayslipsForm = ({ onInsert }) => {
  const [form, setForm] = useState({ UserID: "", MonthYear: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onInsert(form.UserID, form.MonthYear);
      setForm({ UserID: "", MonthYear: "" });
      alert("Payslip generated successfully!");
    } catch (err) {
      alert("Generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payslips-insert-form" onSubmit={handleSubmit}>
      <input
        name="UserID"
        value={form.UserID}
        onChange={handleChange}
        placeholder="User ID"
        type="text"
        required
      />
      <input
        name="MonthYear"
        value={form.MonthYear}
        onChange={handleChange}
        placeholder="Month-Year (e.g., Oct-2025)"
        pattern="^[A-Za-z]{3}-\d{4}$"
        title="Format: MMM-YYYY (e.g., Oct-2025)"
        required
      />
      <button 
        type="submit" 
        className="payslips-download-btn" 
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Payslip"}
      </button>
    </form>
  );
};

export default PayslipsForm;
