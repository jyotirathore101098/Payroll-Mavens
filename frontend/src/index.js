
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import User from './pages/AddUser/AddUserPage';
import AuthPage from './pages/auth/AuthPage';
import Payslips from './pages/payslips/PayslipsPage';
import Payroll from './pages/payroll/PayrollPage';
import PayrollRun from './pages/payrollRun/PayrollRunPage';
import Leaves from './pages/leaves/LeavesPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Compliance from './pages/compliance/CompliancePage';
import SalaryAdjustment from './pages/salaryAdjustment/SalaryAdjustmentPage';
import Reports from './pages/reports/ReportsPage';

function AppLayout() {
  const location = useLocation();
  const hideLayout = location.pathname === "/";

  if (hideLayout) {
    return <Routes><Route path="/" element={<AuthPage />} /></Routes>;
  }

  return (
    <div className='app-container'>
      <Navbar />
      <div className='app-body'>
        <Sidebar />
        <div  className='main-content-wrapper'>
          <Routes>
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/AddUser" element={<User />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/payrollRun" element={<PayrollRun/>} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/compliance" element={<Compliance/>} />
            <Route path="/salaryAdjustment" element={<SalaryAdjustment/>} />
            <Route path="/reports" element={<Reports/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AppLayout/>
  </BrowserRouter>
);


