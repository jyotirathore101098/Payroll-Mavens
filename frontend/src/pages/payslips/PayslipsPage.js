import React, { useEffect, useState } from "react";
import { fetchPayslips, insertPayslip, deletePayslip, downloadPayslip } from "./payslipService";
import PayslipsForm from "./PayslipsForm";
import PayslipsTable from "./PayslipsTable";
import "./PayslipsPage.css";

const PayslipsPage = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayslips = async () => {
    setLoading(true);
    try {
      const data = await fetchPayslips();
      setPayslips(data);
    } catch (err) {
      setError(err.message || "Failed to fetch payslips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayslips();
  }, []);

  const handleInsert = async (userId, monthYear) => {
    await insertPayslip(userId, monthYear);
    loadPayslips();
  };

  const handleDelete = async (payslipId) => {
    await deletePayslip(payslipId);
    loadPayslips();
  };

  const handleDownload = async (payslipId, userId, monthYear) => {
    await downloadPayslip(payslipId, userId, monthYear);
  };

  return (
    <div className="payslips-container">
      <h2 className="payslips-title">Payslips</h2>
      <PayslipsForm onInsert={handleInsert} />
      {loading ? (
        <div className="payslips-loading">Loading...</div>
      ) : error ? (
        <div className="payslips-error">{error}</div>
      ) : !payslips.length ? (
        <div className="payslips-empty">No payslips found.</div>
      ) : (
        <PayslipsTable
          payslips={payslips}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default PayslipsPage;
