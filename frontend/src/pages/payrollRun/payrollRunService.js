import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/payroll-runs";
const API_BASE_PAYROLL = "http://localhost:3000/api/payroll-base";
const API_BASE_LEAVES = "http://localhost:3000/api/leaves";
const API_BASE_ADJUSTMENTS = "http://localhost:3000/api/adjustments";

const getToken = () => localStorage.getItem("token");

export const fetchRunsByUser = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const fetchRuns = async () => {
  const res = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const insertRun = async (data) => {
  return axios.post(API_BASE_URL, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const deleteRun = async (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Payroll Preview Calculation
export const fetchPreview = async (userId, monthYear) => {
  const token = getToken();

  // Payroll base
  const baseRes = await axios.get(`${API_BASE_PAYROLL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const base = baseRes.data;

  // Leaves
  const leaveRes = await axios.get(`${API_BASE_LEAVES}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const leaves = Array.isArray(leaveRes.data)
    ? leaveRes.data.filter((l) => l.MonthYear === monthYear)
    : [];
  const lop = leaves.filter((l) => l.LeaveType === "LOP").reduce((sum, l) => sum + Number(l.LeaveDays), 0);

  // Adjustments
  const adjRes = await axios.get(`${API_BASE_ADJUSTMENTS}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const adjustments = Array.isArray(adjRes.data)
    ? adjRes.data.filter((a) => a.MonthYear === monthYear)
    : [];
  const bonus = adjustments.filter((a) => a.AdjustmentType === "Bonus").reduce((sum, a) => sum + Number(a.Amount), 0);
  const deduction = adjustments.filter((a) => a.AdjustmentType === "Deduction").reduce((sum, a) => sum + Number(a.Amount), 0);

  // Salary calculation
  let grossSalary = Number(base.BasicSalary || 0) + Number(base.HRA || 0) + Number(base.DA || 0) + Number(base.OtherAllowance || 0);
  const lopDeduction = +(lop * (grossSalary / 30)).toFixed(2);
  grossSalary -= lopDeduction;

  const adjustedGross = grossSalary + bonus - deduction;
  const PF = +(adjustedGross * 0.12).toFixed(2);
  const ESI = +(adjustedGross * 0.0075).toFixed(2);
  const TDS = +(adjustedGross * 0.1).toFixed(2);
  const netSalary = +(adjustedGross - PF - ESI - TDS).toFixed(2);

  return { base, leaves, adjustments, grossSalary, lop, lopDeduction, bonus, deduction, adjustedGross, PF, ESI, TDS, netSalary };
};
