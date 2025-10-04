import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/payslips";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Fetch payslips
export const fetchPayslips = async () => {
  const res = await axios.get(`${API_BASE_URL}/my`, getAuthHeaders());
  return res.data;
};

// Insert payslip
export const insertPayslip = async (userId, monthYear) => {
  const prRes = await axios.get("http://localhost:3000/api/payroll-runs", getAuthHeaders());
  const runs = Array.isArray(prRes.data) ? prRes.data : [];
  const run = runs.find((r) => String(r.UserID) === String(userId) && r.MonthYear === monthYear);
  if (!run) throw new Error("No payroll run found for this user and month.");
  await axios.post(`${API_BASE_URL}/generate`, { payrollRunId: run.PayrollRunID }, getAuthHeaders());
};

// Delete payslip
export const deletePayslip = async (payslipId) => {
  await axios.delete(`${API_BASE_URL}/${payslipId}`, getAuthHeaders());
};

// Download payslip
export const downloadPayslip = async (payslipId, userId, monthYear) => {
  const response = await axios.get(`${API_BASE_URL}/download/${payslipId}`, {
    ...getAuthHeaders(),
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Payslip_${userId}_${monthYear}.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
