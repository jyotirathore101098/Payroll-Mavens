import React, { useState } from "react";
import { useLeaves } from "./useLeaves";
import LeavesForm from "./LeavesForm";
import LeavesTable from "./LeavesTable";
import "./LeavesPage.css";

const LeavesPage = () => {
  const { leaves, loading, addLeave, updateLeave, deleteLeave } = useLeaves();
  const [form, setForm] = useState({ UserID: "", LeaveType: "", FromDate: "", ToDate: "", Status: "Pending" });
  const [editId, setEditId] = useState(null);

  const handleEdit = (leave) => {
    setEditId(leave.LeaveID || leave.id);
    setForm({
      UserID: leave.UserID,
      LeaveType: leave.LeaveType,
      FromDate: leave.FromDate,
      ToDate: leave.ToDate,
      Status: leave.Status ? leave.Status : "Pending"
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ UserID: "", LeaveType: "", FromDate: "", ToDate: "", Status: "Pending" });
  };

  // Get user role from localStorage (case-insensitive check)
  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role?.toLowerCase() === "employee";

  return (
    <div className="leaves-container">
      <h2 className="leaves-title">Leave Records</h2>
      <LeavesForm form={form} setForm={setForm} editId={editId} onAdd={addLeave} onUpdate={updateLeave} onCancel={handleCancel} />
      <LeavesTable
        leaves={leaves}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteLeave}
        isEmployee={isEmployee}
      />
    </div>
  );
};

export default LeavesPage;
