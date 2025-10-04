import React from "react";

const AuthForm = ({ isLogin, formData, onChange, onSubmit }) => {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={onChange}
          required
          className="auth-input"
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        required
        className="auth-input"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={onChange}
        required
        className="auth-input"
      />

      {!isLogin && (
        <select
          name="role"
          value={formData.role}
          onChange={onChange}
          className="auth-select"
        >
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          {/* <option value="Employee">Employee</option> */}
        </select>
      )}

      <button type="submit" className="auth-button">
        {isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
