import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "./authService";
import AuthForm from "./AuthForm";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "Admin",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
  setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await login(formData.email, formData.password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`Login successful. Welcome ${data.user?.name || "User"}`);
        navigate("/payroll");
      } else {
        // Ensure role is set
        const regData = { ...formData, role: formData.role || "Admin" };
        await register(regData);
        alert("Registration successful. You can now login.");
        setIsLogin(true);
      }
    } catch (err) {
      let errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        "Something went wrong";
      alert("Error: " + errorMsg);
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-logo">Payroll Maven</h1>
      <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>

      <AuthForm
        isLogin={isLogin}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <div className="auth-footer">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="auth-switch"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
