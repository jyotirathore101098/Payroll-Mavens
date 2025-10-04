import React from "react";
import ReportRow from "./ReportRow";

const ReportsTable = ({ reports }) => {
  const filteredReports = reports.filter(
    (r) => r.id !== "payslip" && r.id !== "compliance" && r.id !== "payroll_summary"
  );

  return (
    <div className="reports-table-container">
      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="4" className="reports-empty">
                  No reports available for download.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <ReportRow key={report.id} report={report} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
