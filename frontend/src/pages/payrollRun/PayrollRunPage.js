import React, { useEffect, useState } from "react";
import { fetchRuns, insertRun, deleteRun, fetchPreview, fetchRunsByUser } from "./payrollRunService";
import PayrollRunForm from "./PayrollRunForm";
import PayrollRunSearchForm from "./PayrollRunSearchForm";
import PayrollRunPreview from "./PayrollRunPreview";
import PayrollRunTable from "./PayrollRunTable";
import "./PayrollRunPage.css";

const PayrollRunPage = () => {
  const [runs, setRuns] = useState([]);
  const [form, setForm] = useState({ UserID: "", MonthYear: "" });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search by UserID handler
  const handleSearch = async (userID) => {
    setSearchLoading(true);
    try {
      if (!userID) {
        const allRuns = await fetchRuns();
        setRuns(allRuns);
      } else {
        const trimmedUserID = userID.trim();
        const runsByUser = await fetchRunsByUser(trimmedUserID);
        setRuns(runsByUser);
        if (!runsByUser || runsByUser.length === 0) {
          alert("No payroll runs found for this User ID.");
        }
      }
    } catch {
      alert("Failed to search payroll runs");
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    try {
      const data = await fetchRuns();
      setRuns(data);
    } catch {
      alert("Failed to fetch payroll runs");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPreview(null); // Hide preview after generating payroll run
    try {
      await insertRun(form);
      const latest = await fetchPreview(form.UserID, form.MonthYear);
      if (latest) {
        setRuns((prev) => [
          { PayrollRunID: "Preview", UserID: form.UserID, MonthYear: form.MonthYear, ...latest, SalaryAdjustment: `${latest.bonus ? "+"+latest.bonus : ""}${latest.deduction ? " -"+latest.deduction : ""}` },
          ...prev,
        ]);
      } else {
        loadRuns();
      }
      setForm({ UserID: "", MonthYear: "" });
      alert("Payroll run inserted successfully!");
    } catch (err) {
      alert("Insert failed: " + (err?.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const latest = await fetchPreview(form.UserID, form.MonthYear);
      setPreview(latest);
    } catch (err) {
      alert("Preview failed: " + (err?.response?.data?.message || err.message));
    }
    setPreviewLoading(false);
  };

  const handleDelete = async (run) => {
    if (run.PayrollRunID === "Preview") {
      alert("Cannot delete preview data. Refresh the page to clear preview.");
      return;
    }
    if (!window.confirm("Delete this payroll run?")) return;
    try {
      await deleteRun(run.PayrollRunID);
      loadRuns();
    } catch (err) {
      alert("Delete failed: " + (err?.response?.data?.message || err.message));
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "";
  return (
    <div className="payrollrun-container">
      <h2 className="payrollrun-title">Payroll Run Records</h2>
      {role !== "Employee" && (
        <>
          <PayrollRunForm form={form} loading={loading} previewLoading={previewLoading} onChange={handleChange} onSubmit={handleSubmit} onPreview={handlePreview} />
          <PayrollRunSearchForm onSearch={handleSearch} loading={searchLoading} />
          <PayrollRunPreview preview={preview} />

        </>
      )}
      <PayrollRunTable runs={runs} onDelete={handleDelete} />
    </div>
  );
};

export default PayrollRunPage;
