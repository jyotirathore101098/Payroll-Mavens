import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/leaves";

export const useLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Fetch leaves error:", err);
      alert("Failed to fetch leaves");
    }
    setLoading(false);
  };
    // Fetch own leaves for employee
  const fetchOwnLeaves = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Fetch own leaves error:", err);
      alert("Failed to fetch your leaves");
    }
    setLoading(false);
  };
  

  const addLeave = async (data) => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_BASE_URL}/createLeave`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLeaves();
  };

  const updateLeave = async (id, data) => {
    const token = localStorage.getItem("token");
    await axios.put(`${API_BASE_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLeaves();
  };

  const deleteLeave = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLeaves();
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return { leaves, loading, addLeave, updateLeave, deleteLeave, fetchOwnLeaves};
};
