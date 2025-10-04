import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/compliance";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchComplianceRules = async () => {
  const res = await axios.get(API_BASE_URL, getAuthHeaders());
  return res.data;
};

export const addComplianceRule = async (form) => {
  await axios.post(API_BASE_URL, form, getAuthHeaders());
};

export const updateComplianceRule = async (id, form) => {
  await axios.put(`${API_BASE_URL}/${id}`, form, getAuthHeaders());
};

export const deleteComplianceRule = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
};
