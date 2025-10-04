import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/adjustments";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchAdjustments = async () => {
  const res = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
  return Array.isArray(res.data) ? res.data : [];
};

export const addAdjustment = async (adjustment) => {
  await axios.post(API_BASE_URL, adjustment, { headers: getAuthHeaders() });
};

export const updateAdjustment = async (id, adjustment) => {
  await axios.put(`${API_BASE_URL}/${id}`, adjustment, { headers: getAuthHeaders() });
};

export const deleteAdjustment = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
};
