import React from "react";

// Format date as DD-MM-YYYY
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const LeavesTable = ({ leaves, loading, onEdit, onDelete, isEmployee }) => {
  const formatLeaveType = (type) => {
    const typeMap = {
  'Casual': 'Casual Leave',
  'Sick': 'Sick Leave',
  'LOP': 'Loss of Pay',
    };
    return typeMap[type] || type;
  };

  const formatLeaveDays = (days) => {
    const numDays = parseFloat(days);
    if (numDays === 1) return '1 Day';
    if (numDays % 1 === 0) return `${numDays} Days`;
    return `${numDays} Days`;
  };

  const formatStatus = (status) => {
    const statusMap = {
      'Pending': '🟡 Pending',
      'Approved': '🟢 Approved',
      'Rejected': '🔴 Rejected',
    };
    return statusMap[status] || status;
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
            <th>Name</th>
            <th>Leave Type</th>
            <th>Days</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Status</th>
            {!isEmployee && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan={isEmployee ? 7 : 8} className="empty-state">
                No leave records found. Add your first leave record above.
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.LeaveID || leave.id}>
                <td>{leave.UserID}</td>
                <td>{leave.UserName || "-"}</td>
                <td>{formatLeaveType(leave.LeaveType)}</td>
                <td>{formatLeaveDays(leave.LeaveDays)}</td>
                <td>{leave.FromDate ? formatDate(leave.FromDate) : ""}</td>
                <td>{leave.ToDate ? formatDate(leave.ToDate) : ""}</td>
                <td>{formatStatus(leave.Status)}</td>
                {!isEmployee && (
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
                          if (
                            window.confirm(
                              "Are you sure you want to delete this leave record?"
                            )
                          ) {
                            onDelete(leave.LeaveID || leave.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeavesTable;
