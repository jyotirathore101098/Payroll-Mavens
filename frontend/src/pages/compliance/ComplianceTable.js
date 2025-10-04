import React from "react";
import ComplianceRow from "./ComplianceRow";

const ComplianceTable = ({ rules, onEdit, onDelete }) => {
  return (
    <div className="compliance-table-wrapper">
      <table className="compliance-table">
        <thead>
          <tr>
            <th>Rule Name</th>
            <th>Value</th>
            <th>Description</th>
            <th>Effective From</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.length > 0 ? (
            rules.map((rule) => (
              <ComplianceRow 
                key={rule.RuleID} 
                rule={rule} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))
          ) : (
            <tr>
              <td 
                colSpan="5" 
                style={{ 
                  textAlign: "center", 
                  color: "#6b7280", 
                  padding: "24px",
                  fontStyle: "italic"
                }}
              >
                No compliance rules found. Add your first rule above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplianceTable;
