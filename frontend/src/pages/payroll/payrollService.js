import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/payroll-base";

const getToken = () => localStorage.getItem("token");

export const fetchPayrolls = async () => {
  const res = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const createPayroll = async (data) => {
  return axios.post(`${API_BASE_URL}/create`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const updatePayroll = async (id, data) => {
  return axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const deletePayroll = async (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};
