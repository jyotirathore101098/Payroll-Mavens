import React from "react";

const PayrollRunPreview = ({ preview }) => {
  if (!preview) return null;
  
  const formatCurrency = (value) => `₹${parseFloat(value || 0).toLocaleString()}`;
  
  return (
    <div className="preview-container">
      <h3 className="preview-title">Payroll Calculation Preview</h3>
      
      <div className="preview-summary">
        <div className="preview-item">
          <div className="preview-label">Gross Salary</div>
          <div className="preview-value">{formatCurrency(preview.grossSalary)}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">LOP Days</div>
          <div className="preview-value">{preview.lop}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">LOP Deduction</div>
          <div className="preview-value">{formatCurrency(preview.lopDeduction)}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">Bonus</div>
          <div className="preview-value">{formatCurrency(preview.bonus)}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">Deduction</div>
          <div className="preview-value">{formatCurrency(preview.deduction)}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">Adjusted Gross</div>
          <div className="preview-value">{formatCurrency(preview.adjustedGross)}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">PF (12%)</div>
          <div className="preview-value">{formatCurrency(preview.PF)}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">ESI (0.75%)</div>
          <div className="preview-value">{formatCurrency(preview.ESI)}</div>
        </div>
        <div className="preview-item">
          <div className="preview-label">TDS (10%)</div>
          <div className="preview-value">{formatCurrency(preview.TDS)}</div>
        </div>
        <div className="preview-item" style={{ gridColumn: '1 / -1' }}>
          <div className="preview-label">Net Salary</div>
          <div className="preview-value" style={{ fontSize: '1.5rem', color: '#059669' }}>
            {formatCurrency(preview.netSalary)}
          </div>
        </div>
      </div>
      
      <div className="preview-details">
        <div className="preview-section">
          <div className="preview-section-title">Payroll Base Details</div>
          <pre className="preview-json">{JSON.stringify(preview.base, null, 2)}</pre>
        </div>
        
        <div className="preview-section">
          <div className="preview-section-title">Leave Records (Current Month)</div>
          <pre className="preview-json">
            {preview.leaves.length > 0 
              ? JSON.stringify(preview.leaves, null, 2)
              : 'No leave records found for this month'
            }
          </pre>
        </div>
        
        <div className="preview-section">
          <div className="preview-section-title">Salary Adjustments (Current Month)</div>
          <pre className="preview-json">
            {preview.adjustments.length > 0 
              ? JSON.stringify(preview.adjustments, null, 2)
              : 'No salary adjustments found for this month'
            }
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PayrollRunPreview;
