import React, { useEffect, useState } from "react";
import SalaryAdjustmentForm from "./SalaryAdjustmentForm";
import SalaryAdjustmentTable from "./SalaryAdjustmentTable";
import {
  fetchAdjustments,
  addAdjustment,
  updateAdjustment,
  deleteAdjustment
} from "./salaryAdjustmentService";
import "./SalaryAdjustmentPage.css";

const SalaryAdjustmentPage = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [form, setForm] = useState({ UserID: "", AdjustmentType: "", Amount: "", MonthYear: "", Remarks: "" });
  const [editId, setEditId] = useState(null);

  const loadAdjustments = async () => {
    try {
      const data = await fetchAdjustments();
      setAdjustments(data);
    } catch (err) {
      alert(err?.message || "Failed to fetch adjustments");
    }
  };

  useEffect(() => { loadAdjustments(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addAdjustment(form);
    setForm({ UserID: "", AdjustmentType: "", Amount: "", MonthYear: "", Remarks: "" });
    loadAdjustments();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateAdjustment(editId, form);
    setEditId(null);
    setForm({ UserID: "", AdjustmentType: "", Amount: "", MonthYear: "", Remarks: "" });
    loadAdjustments();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this adjustment?")) return;
    await deleteAdjustment(id);
    loadAdjustments();
  };

  const handleEdit = (adj) => {
    setEditId(adj.AdjustmentID || adj._id);
    setForm({ UserID: adj.UserID, AdjustmentType: adj.AdjustmentType, Amount: adj.Amount, MonthYear: adj.MonthYear, Remarks: adj.Remarks });
  };

  return (
    <div className="salary-adjustment-container">
      <h2 className="salary-adjustment-title">Salary Adjustments</h2>
      <SalaryAdjustmentForm
        form={form}
        setForm={setForm}
        editId={editId}
        setEditId={setEditId}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
      />
      <SalaryAdjustmentTable
        adjustments={adjustments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SalaryAdjustmentPage;
