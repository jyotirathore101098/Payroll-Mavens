import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/auth";

export const login = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return res.data;
};

export const register = async (formData) => {
  const res = await axios.post(`${API_BASE_URL}/register`, formData);
  return res.data;
};
