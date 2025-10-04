import React, { useEffect, useState } from "react";
import { fetchReports } from "./reportsService";
import ReportsTable from "./ReportsTable";
import "./ReportsPage.css";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReports();
      setReports(data);
    } catch (err) {
      setError(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Available Reports</h2>
      {loading ? (
        <div className="reports-loading">Loading...</div>
      ) : error ? (
        <div className="reports-error">{error}</div>
      ) : (
        <ReportsTable reports={reports} />
      )}
    </div>
  );
};

export default ReportsPage;
