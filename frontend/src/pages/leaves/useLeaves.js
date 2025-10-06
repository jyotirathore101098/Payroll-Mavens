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
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "Employee") {
        // Fetch only own leaves for employee
        const res = await axios.get(`${API_BASE_URL}/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } else {
        // HR/Admin: fetch all leaves
        const res = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      }
    } catch (err) {
      console.error("Fetch leaves error:", err);
      alert("Failed to fetch leaves");
    }
    setLoading(false);
  };
  

  const addLeave = async (data) => {
    const token = localStorage.getItem("token");
    // Only send relevant fields
    const payload = {
      UserID: data.UserID,
      LeaveType: data.LeaveType,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      Status: data.Status,
    };
    await axios.post(`${API_BASE_URL}/createLeave`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLeaves();
  };

  const updateLeave = async (id, data) => {
    const token = localStorage.getItem("token");
    const payload = {
      LeaveType: data.LeaveType,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      Status: data.Status,
    };
    await axios.put(`${API_BASE_URL}/${id}`, payload, {
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

  return { leaves, loading, addLeave, updateLeave, deleteLeave };
};
