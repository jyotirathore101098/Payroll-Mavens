import React from "react";
import "./PayrollPage.css";

const PayrollTable = ({ payrolls, onEdit, onDelete }) => {
  return (
    <div className="payroll-table-container">
      <table className="payroll-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Basic Salary</th>
            <th>HRA</th>
            <th>DA</th>
            <th>Other Allowance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "24px" }}>
                No payroll records found.
              </td>
            </tr>
          ) : (
            payrolls.map((p) => (
              <tr key={p.UserID}>
                <td>{p.UserID}</td>
                <td>₹{p.BasicSalary?.toLocaleString() || '0'}</td>
                <td>₹{p.HRA?.toLocaleString() || '0'}</td>
                <td>₹{p.DA?.toLocaleString() || '0'}</td>
                <td>₹{p.OtherAllowance?.toLocaleString() || '0'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      className="payroll-btn" 
                      onClick={() => onEdit(p)}
                      style={{ fontSize: '0.875rem', padding: '6px 12px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="payroll-btn"
                      style={{ 
                        fontSize: '0.875rem', 
                        padding: '6px 12px',
                        background: "#E53E3E", 
                        color: "white" 
                      }}
                      onClick={() => onDelete(p.UserID)}
                    >
                      Delete
                    </button>
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

export default PayrollTable;
