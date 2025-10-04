import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { FaCloud } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <FaCloud className="navbar-brand-icon" />
        <span>Payroll Maven</span>
      </div>
      <div className="navbar-center">Payroll Management</div>
      <div className="navbar-right">
        <button className="navbar-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
