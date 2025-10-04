import React from "react";
import PayslipRow from "./PayslipRow";

const PayslipsTable = ({ payslips, onDelete, onDownload }) => {
  return (
    <div className="payslips-table-container">
      <div className="payslips-table-wrapper">
        <table className="payslips-table">
          <thead>
            <tr>
              <th>Payslip ID</th>
              <th>User ID</th>
              <th>Month/Year</th>
              <th>Net Salary</th>
              <th>Download</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.length === 0 ? (
              <tr>
                <td colSpan={6} className="payslips-empty">
                  No payslips found. Generate your first payslip above.
                </td>
              </tr>
            ) : (
              payslips.map((slip) => (
                <PayslipRow
                  key={slip.PayslipID}
                  slip={slip}
                  onDelete={onDelete}
                  onDownload={onDownload}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipsTable;
