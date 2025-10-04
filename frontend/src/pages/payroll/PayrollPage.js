
import React, { useEffect, useState } from "react";
import { fetchPayrolls, createPayroll, updatePayroll, deletePayroll } from "./payrollService";
import PayrollForm from "./PayrollForm";
import PayrollTable from "./PayrollTable";
import "./PayrollPage.css";

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [form, setForm] = useState({
    UserID: "",
    BasicSalary: "",
    HRA: "",
    DA: "",
    OtherAllowance: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPayrolls();
  }, []);

  const loadPayrolls = async () => {
    try {
      const data = await fetchPayrolls();
      setPayrolls(data);
    } catch (err) {
      alert("Failed to fetch payrolls");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updatePayroll(editId, form);
      } else {
        await createPayroll(form);
      }
      setForm({ UserID: "", BasicSalary: "", HRA: "", DA: "", OtherAllowance: "" });
      setEditId(null);
      loadPayrolls();
    } catch (err) {
      alert("Failed to save payroll");
      console.error(err);
    }
  };

  const handleEdit = (payroll) => {
    setEditId(payroll.UserID);
    setForm({
      UserID: payroll.UserID,
      BasicSalary: payroll.BasicSalary,
      HRA: payroll.HRA,
      DA: payroll.DA,
      OtherAllowance: payroll.OtherAllowance,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payroll record?")) return;
    try {
      await deletePayroll(id);
      loadPayrolls();
    } catch (err) {
      alert("Failed to delete payroll");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ UserID: "", BasicSalary: "", HRA: "", DA: "", OtherAllowance: "" });
  };

  return (
    <div className="payroll-container">
      <h2 className="payroll-title">Payroll Base Management</h2>
      <PayrollForm
        form={form}
        editId={editId}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      <PayrollTable payrolls={payrolls} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default PayrollPage;
