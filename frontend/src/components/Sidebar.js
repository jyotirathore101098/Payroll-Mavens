import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaUserPlus,
  FaMoneyBillWave, 
  FaPlay, 
  FaCalendarAlt, 
  FaClipboardCheck, 
  FaChartBar, 
  FaAdjust, 
  FaFileInvoice 
} from 'react-icons/fa';
import './Sidebar.css';



const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user.role;
  console.log(role);
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">

        {role !== "Employee" && (
        <NavLink to="/AddUser" className="sidebar-link">
          < FaUserPlus className="sidebar-icon" />
          <span>Add User</span>
        </NavLink>
         )} 
         {role !== "Employee" && (
        <NavLink to="/payroll" className="sidebar-link">
          <FaMoneyBillWave className="sidebar-icon" />
          <span>Payroll</span>
        </NavLink>
         )} 

         {role !== "Employee" && (
        <NavLink to="/leaves" className="sidebar-link">
          <FaCalendarAlt className="sidebar-icon" />
          <span>Leaves</span>
        </NavLink>
         )} 

         {role !== "Employee" && (
        <NavLink to="/salaryAdjustment" className="sidebar-link">
          <FaAdjust className="sidebar-icon" />
          <span>Salary Adjustment</span>
        </NavLink>
         )} 
        <NavLink to="/payrollRun" className="sidebar-link">
          <FaPlay className="sidebar-icon" />
          <span>Payroll Run</span>
        </NavLink>
        
         <NavLink to="/payslips" className="sidebar-link">
          <FaFileInvoice className="sidebar-icon" />
          <span>Payslips</span>
        </NavLink>
        
        {role !== "Employee" && (
        <NavLink to="/compliance" className="sidebar-link">
          <FaClipboardCheck className="sidebar-icon" />
          <span>Compliance</span>
        </NavLink>
        )} 
        
        {role !== "Employee" && (
        <NavLink to="/reports" className="sidebar-link">
          <FaChartBar className="sidebar-icon" />
          <span>Reports</span>
        </NavLink>
        )} 
        
       
      </nav>
    </aside>
  );
};

export default Sidebar;
