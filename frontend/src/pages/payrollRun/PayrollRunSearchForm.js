import React, { useState } from "react";

const PayrollRunSearchForm = ({ onSearch, loading }) => {
  const [userID, setUserID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userID) {
      alert("Please enter a User ID to search.");
      return;
    }
    onSearch(userID);
  };

  return (
    <form className="payrollrun-search-form" onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input
        name="UserID"
        value={userID}
        onChange={e => setUserID(e.target.value)}
        placeholder="Search by User ID"
        type="text"
        className="payrollrun-input"
        required
      />
      <button
        type="submit"
        className="payrollrun-btn search"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default PayrollRunSearchForm;
