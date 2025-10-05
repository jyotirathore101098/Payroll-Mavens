import React, { useState } from "react";
import { useLeaves } from "./useLeaves";
import LeavesForm from "./LeavesForm";
import LeavesTable from "./LeavesTable";
import "./LeavesPage.css";

const LeavesPage = () => {
  const { leaves, loading, addLeave, updateLeave, deleteLeave ,fetchOwnLeaves} = useLeaves();
  const [form, setForm] = useState({ UserID: "", LeaveType: "", LeaveDays: "", MonthYear: "" });
  const [editId, setEditId] = useState(null);

  const handleEdit = (leave) => {
    setEditId(leave.LeaveID || leave.id);
    setForm({
      UserID: leave.UserID,
      LeaveType: leave.LeaveType,
      LeaveDays: leave.LeaveDays,
      MonthYear: leave.MonthYear,
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ UserID: "", LeaveType: "", LeaveDays: "", MonthYear: "" });
  };

  return (
    <div className="leaves-container">
      <h2 className="leaves-title">Leave Records</h2>
      <LeavesForm form={form} setForm={setForm} editId={editId} onAdd={addLeave} onUpdate={updateLeave} onCancel={handleCancel} />
      <LeavesTable leaves={leaves} loading={loading} onEdit={handleEdit} onDelete={deleteLeave} fetchOwnLeaves={fetchOwnLeaves} />
    </div>
  );
};

export default LeavesPage;
