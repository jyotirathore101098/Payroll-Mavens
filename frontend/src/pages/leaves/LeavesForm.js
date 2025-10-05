import React from "react";

const LeavesForm = ({ form, setForm, editId, onAdd, onUpdate, onCancel }) => {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? onUpdate(editId, form) : onAdd(form);
    setForm({ UserID: "", LeaveType: "", LeaveDays: "", MonthYear: "" });
  };

  return (
    <form className="leaves-form" onSubmit={handleSubmit}>
      <input 
        className="leaves-input" 
        name="UserID" 
        value={form.UserID} 
        onChange={handleChange} 
        placeholder="User ID"
        type="text"
        required 
      />
      <select 
        className="leaves-input" 
        name="LeaveType" 
        value={form.LeaveType} 
        onChange={handleChange} 
        required
      >
        <option value="">Select Leave Type</option>
        <option value="Casual">Casual Leave</option>
        <option value="Sick">Sick Leave</option>
        <option value="LOP">Loss of Pay (LOP)</option>
      </select>
      <input 
        className="leaves-input" 
        type="number" 
        name="LeaveDays" 
        value={form.LeaveDays} 
        onChange={handleChange} 
        placeholder="Number of Days"
        min="1"
        step="1"
        required 
      />
      <input 
        className="leaves-input" 
        name="MonthYear" 
        value={form.MonthYear} 
        onChange={handleChange} 
        placeholder="Month-Year (e.g., Oct-2025)"
        pattern="[A-Za-z]{3}-[0-9]{4}"
        title="Format: MMM-YYYY (e.g., Oct-2025)"
        required 
      />
      <select
        className="leaves-input"
        name="Status"
        value={form.Status || "Pending"}
        onChange={handleChange}
        required
      >
        <option value="">Pending</option>
        <option value="Pending">Status</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      <div className="form-buttons">
        <button className="leaves-btn" type="submit">
          {editId ? "Update Leave" : "Add Leave"}
        </button>
        {editId && (
          <button 
            className="leaves-btn cancel" 
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

export default LeavesForm;
