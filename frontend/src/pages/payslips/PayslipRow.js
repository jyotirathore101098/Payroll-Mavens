import React from "react";

const PayslipRow = ({ slip, onDelete, onDownload }) => {
  const formatCurrency = (value) => {
    if (!value) return "—";
    return `₹${parseFloat(value).toLocaleString()}`;
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete payslip for User ${slip.UserID} (${slip.MonthYear})?`)) {
      onDelete(slip.PayslipID);
    }
  };

  const handleDownload = () => {
    try {
      onDownload(slip.PayslipID, slip.UserID, slip.MonthYear);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  return (
    <tr>
      <td>{slip.PayslipID}</td>
      <td>{slip.UserID}</td>
      <td>{slip.MonthYear}</td>
      <td className="currency">{formatCurrency(slip.NetSalary)}</td>
      <td>
        <div className="action-buttons">
          <button
            className="payslips-download-btn"
            onClick={handleDownload}
            title="Download PDF"
          >
            Download
          </button>
        </div>
      </td>
      <td>
        <div className="action-buttons">
          <button
            className="payslips-delete-btn"
            onClick={handleDelete}
            title="Delete payslip"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PayslipRow;
