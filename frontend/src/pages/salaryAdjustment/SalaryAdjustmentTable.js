// src/pages/SalaryAdjustmentPage/SalaryAdjustmentTable.js
import React from "react";

const SalaryAdjustmentTable = ({ adjustments, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  return (
    <div className="salary-adjustment-table-wrapper">
      <table className="salary-adjustment-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Month/Year</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adjustments.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                No adjustments found.
              </td>
            </tr>
          ) : (
            adjustments.map((adj) => (
              <tr key={adj.AdjustmentID || adj._id}>
                <td>{adj.UserID}</td>
                <td>{adj.AdjustmentType}</td>
                <td>{formatCurrency(adj.Amount)}</td>
                <td>{adj.MonthYear}</td>
                <td>{adj.Remarks}</td>
                <td>
                  <div className="action-buttons">
                    <button className="salary-adjustment-btn" onClick={() => onEdit(adj)}>Edit</button>
                    <button className="salary-adjustment-btn delete" onClick={() => onDelete(adj.AdjustmentID || adj._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryAdjustmentTable;
