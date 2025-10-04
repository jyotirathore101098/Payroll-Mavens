import React from "react";

const ComplianceRow = ({ rule, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatValue = (value) => {
    if (!value) return "0";
    const numValue = parseFloat(value);
    // If value is less than 1, assume it's a percentage
    if (numValue < 1 && numValue > 0) {
      return `${(numValue * 100).toFixed(2)}%`;
    }
    // Otherwise, treat as fixed amount
    return `₹${numValue.toLocaleString()}`;
  };

  return (
    <tr>
      <td>{rule.Name}</td>
      <td>{formatValue(rule.Value)}</td>
      <td>{rule.Description || "—"}</td>
      <td>{formatDate(rule.EffectiveFrom)}</td>
      <td>
        <div className="action-buttons">
          <button 
            className="compliance-btn" 
            onClick={() => onEdit(rule)}
          >
            Edit
          </button>
          <button 
            className="compliance-btn delete" 
            onClick={() => onDelete(rule.RuleID)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ComplianceRow;

