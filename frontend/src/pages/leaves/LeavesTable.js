import React from "react";

const LeavesTable = ({ leaves, loading, onEdit, onDelete }) => {
  const formatLeaveType = (type) => {
    const typeMap = {
      'Casual': 'Casual Leave',
      'Sick': 'Sick Leave',
      'LOP': 'Loss of Pay',
      'Maternity': 'Maternity Leave',
      'Paternity': 'Paternity Leave',
      'Annual': 'Annual Leave',
      'Emergency': 'Emergency Leave'
    };
    return typeMap[type] || type;
  };

  const formatLeaveDays = (days) => {
    const numDays = parseFloat(days);
    if (numDays === 1) return '1 Day';
    if (numDays === 0.5) return '½ Day';
    if (numDays % 1 === 0) return `${numDays} Days`;
    return `${numDays} Days`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading leave records...</div>
      </div>
    );
  }

  return (
    <div className="leaves-table-wrapper">
      <table className="leaves-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Leave Type</th>
            <th>Days</th>
            <th>Month-Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td 
                colSpan={5} 
                className="empty-state"
              >
                No leave records found. Add your first leave record above.
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.LeaveID || leave.id}>
                <td>{leave.UserID}</td>
                <td>{formatLeaveType(leave.LeaveType)}</td>
                <td>{formatLeaveDays(leave.LeaveDays)}</td>
                <td>{leave.MonthYear}</td>
                <td>
                  <div className="leaves-action-btns">
                    <button 
                      className="leaves-btn" 
                      onClick={() => onEdit(leave)}
                    >
                      Edit
                    </button>
                    <button 
                      className="leaves-btn delete" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this leave record?')) {
                          onDelete(leave.LeaveID || leave.id);
                        }
                      }}
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

export default LeavesTable;
