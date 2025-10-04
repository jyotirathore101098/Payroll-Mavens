import React, { useState } from 'react';
import axios from 'axios';
import './AddUserPage.css';
import { FaUserPlus } from 'react-icons/fa';

const AddUserPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      setMessage('User added successfully!');
      setForm({ name: '', email: '', password: '', role: 'Employee' });
    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Failed to add user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <h2><FaUserPlus /> Add User</h2>
      <form className="add-user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
      {message && <div className="add-user-message">{message}</div>}
    </div>
  );
};

export default AddUserPage;
