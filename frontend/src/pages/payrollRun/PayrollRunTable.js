import React from "react";

const PayrollRunTable = ({ runs, onDelete }) => {
  const formatCurrency = (value) => {
    if (!value || value === 'N/A') return '—';
    return `₹${parseFloat(value).toLocaleString()}`;
  };

  const formatAdjustments = (adjustment) => {
    if (!adjustment || adjustment === 'N/A') return '—';
    return adjustment;
  };

  const handleDelete = (run) => {
    if (run.PayrollRunID === 'Preview') return;
    
    if (window.confirm(`Are you sure you want to delete payroll run for User ${run.UserID} (${run.MonthYear})?`)) {
      onDelete(run);
    }
  };

  return (
    <div className="payrollrun-table-container">
      <div className="payrollrun-table-wrapper">
        <table className="payrollrun-table">
          <thead>
            <tr>
              <th>PayrollRun ID</th>
              <th>User ID</th>
              <th>Month/Year</th>
              <th>Gross Salary</th>
              <th>Net Salary</th>
              <th>PF</th>
              <th>ESI</th>
              <th>TDS</th>
              <th>Adjustments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-state">
                  No payroll runs found. Generate your first payroll run above.
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr key={run.PayrollRunID} style={run.PayrollRunID === 'Preview' ? { backgroundColor: '#fef3c7' } : {}}>
                  <td>
                    {run.PayrollRunID === 'Preview' ? (
                      <span style={{ fontWeight: 'bold', color: '#d97706' }}>PREVIEW</span>
                    ) : (
                      run.PayrollRunID
                    )}
                  </td>
                  <td>{run.UserID}</td>
                  <td>{run.MonthYear}</td>
                  <td className="currency">{formatCurrency(run.GrossSalary)}</td>
                  <td className="currency" style={{ fontWeight: 'bold', color: '#059669' }}>
                    {formatCurrency(run.NetSalary)}
                  </td>
                  <td className="currency">{formatCurrency(run.PF)}</td>
                  <td className="currency">{formatCurrency(run.ESI)}</td>
                  <td className="currency">{formatCurrency(run.TDS)}</td>
                  <td style={{ fontSize: '0.75rem' }}>{formatAdjustments(run.SalaryAdjustment)}</td>
                  <td>
                    <div className="payrollrun-action-btns">
                      <button
                        className={`payrollrun-btn delete ${
                          run.PayrollRunID === 'Preview' ? 'disabled' : ''
                        }`}
                        onClick={() => handleDelete(run)}
                        disabled={run.PayrollRunID === 'Preview'}
                        title={run.PayrollRunID === 'Preview' ? 'Cannot delete preview' : 'Delete payroll run'}
                      >
                        {run.PayrollRunID === 'Preview' ? 'Preview' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollRunTable;
