import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaCloud } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || user?.username || "";
  const role = user?.role || "";
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <FaCloud className="navbar-brand-icon" />
        <span>Payroll Maven</span>
      </div>
      <div className="navbar-center">Payroll Management</div>
      <div className="navbar-right">
        {username && (
          <span className="navbar-welcome">
            Welcome {username}
            {role && ` (${role} Login) `}
          </span>
        )}

        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
