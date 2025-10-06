import React from "react";

const LeavesForm = ({ form, setForm, editId, onAdd, onUpdate, onCancel }) => {

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Calculate LeaveDays before submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let { FromDate, ToDate, Status } = form;
    // Ensure dates are sent as 'YYYY-MM-DD' strings
    if (FromDate) {
      FromDate = new Date(FromDate).toISOString().slice(0, 10);
    }
    if (ToDate) {
      ToDate = new Date(ToDate).toISOString().slice(0, 10);
    }
    let LeaveDays = "";
    if (FromDate && ToDate) {
      const from = new Date(FromDate);
      const to = new Date(ToDate);
      if (!isNaN(from) && !isNaN(to) && from <= to) {
        LeaveDays = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    // Always send Status, default to Pending if missing
    if (!Status) Status = "Pending";
    const submitForm = { ...form, FromDate, ToDate, LeaveDays, Status };
    if (editId) {
      onUpdate(editId, submitForm);
    } else {
      onAdd(submitForm);
      // Clear editId after adding a new leave (if managed in parent)
      if (typeof window !== 'undefined' && window.setEditId) window.setEditId(null);
    }
    setForm({ UserID: "", LeaveType: "", FromDate: "", ToDate: "", LeaveDays: "", Status: "Pending" });
  };

  const user = JSON.parse(localStorage.getItem("user"));
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
      {/* Removed UserName field, not needed for backend */}
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
        type="date"
        name="FromDate"
        value={form.FromDate || ""}
        onChange={handleChange}
        placeholder="From Date"
        required
      />
      <input
        className="leaves-input"
        type="date"
        name="ToDate"
        value={form.ToDate || ""}
        onChange={handleChange}
        placeholder="To Date"
        required
      />
      {user && user.role !== "Employee" && (
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
      )}
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
