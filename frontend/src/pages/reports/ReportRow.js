import React from "react";
import { 
  fetchLeaves, 
  fetchSalaryAdjustments, 
  downloadReport,
  downloadLeavesReport,
  downloadSalaryAdjustmentsReport,
  downloadComplianceReport
} from "./reportsService";
import Papa from "papaparse";

const ReportRow = ({ report }) => {
  const handleLeavesDownload = async () => {
    try {
      // Try the direct report endpoint first
      await downloadLeavesReport();
    } catch (err) {
      console.log('Direct download failed, trying CSV generation:', err.message);
      // Fallback to CSV generation from raw data
      try {
        const leaves = await fetchLeaves();
        if (!Array.isArray(leaves) || leaves.length === 0) {
          alert("No leaves data available for download.");
          return;
        }
        const headers = ["LeaveID","UserID","LeaveType","LeaveDays","MonthYear","CreatedAt"];
        const csvContent = Papa.unparse(leaves, { header: true, columns: headers });
        triggerDownload(csvContent, "leaves_report.csv");
      } catch (fallbackErr) {
        alert("Download failed: " + fallbackErr.message);
      }
    }
  };

  const handleSalaryAdjustmentsDownload = async () => {
    try {
      // Try the direct report endpoint first
      await downloadSalaryAdjustmentsReport();
    } catch (err) {
      console.log('Direct download failed, trying CSV generation:', err.message);
      // Fallback to CSV generation from raw data
      try {
        const adjustments = await fetchSalaryAdjustments();
        if (!Array.isArray(adjustments) || adjustments.length === 0) {
          alert("No salary adjustment data available for download.");
          return;
        }
        const formatted = adjustments.map(a => ({
          AdjustmentID: a.AdjustmentID || "",
          UserID: a.UserID || "",
          Amount: a.Amount || "",
          Reason: a.Reason || "",
          MonthYear: a.MonthYear || "",
          CreatedAt: a.CreatedAt || ""
        }));
        const headers = ["AdjustmentID","UserID","Amount","Reason","MonthYear","CreatedAt"];
        const csvContent = Papa.unparse(formatted, { header: true, columns: headers });
        triggerDownload(csvContent, "salary_adjustments_report.csv");
      } catch (fallbackErr) {
        alert("Download failed: " + fallbackErr.message);
      }
    }
  };

  const handleComplianceDownload = async () => {
    try {
      await downloadComplianceReport();
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  const triggerDownload = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleGenericDownload = async () => {
    try {
      const fileName = report.id === "compliance_csv"
        ? `compliance_report_Sep-2025.csv`
        : `${report.id}_report.csv`;
      await downloadReport(report.endpoint, fileName);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  const formatReportType = (name) => {
    return name?.replace(/_/g, ' ').toUpperCase() || 'REPORT';
  };

  const renderDownloadButton = () => {
    if (report.id === "leaves_csv") {
      return (
        <button 
          className="reports-download-btn" 
          onClick={handleLeavesDownload}
          title="Download leaves data as CSV"
        >
          Download
        </button>
      );
    }
    
    if (report.id === "salary_adjustment_csv") {
      return (
        <button 
          className="reports-download-btn" 
          onClick={handleSalaryAdjustmentsDownload}
          title="Download salary adjustments as CSV"
        >
          Download
        </button>
      );
    }
    
    if (report.id === "compliance_csv") {
      return (
        <button 
          className="reports-download-btn" 
          onClick={handleComplianceDownload}
          title="Download compliance report as CSV"
        >
          Download
        </button>
      );
    }
    
    if (report.endpoint) {
      return (
        <button 
          className="reports-download-btn" 
          onClick={handleGenericDownload}
          title={`Download ${report.name} report`}
        >
          Download
        </button>
      );
    }
    
    return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>N/A</span>;
  };

  return (
    <tr key={report.id}>
      <td>
        <span className="report-id">{report.id}</span>
      </td>
      <td>
        <span className="report-type">{formatReportType(report.name)}</span>
      </td>
      <td>{report.description}</td>
      <td>
        {renderDownloadButton()}
      </td>
    </tr>
  );
};

export default ReportRow;
