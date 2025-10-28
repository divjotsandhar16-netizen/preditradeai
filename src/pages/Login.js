import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/*
  Simple frontend-only auth using localStorage key 'pt_user'
  Demo credentials: demo@predi.ai / demo123
*/
export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("pt_user") || "null");

    // demo shortcut
    if (email === "demo@predi.ai" && pass === "demo123") {
      localStorage.setItem("pt_user", JSON.stringify({ email: "demo@predi.ai" }));
      navigate("/dashboard", { replace: true });
      return;
    }

    if (stored && stored.email === email && stored.pass === pass) {
      localStorage.setItem("pt_user", JSON.stringify({ email }));
      navigate("/dashboard", { replace: true });
      return;
    }

    alert("Invalid credentials. Use Signup or demo@predi.ai / demo123");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="brand">PrediTrade<span className="accent">AI</span></h2>
        <p className="auth-sub">Professional stock forecasting demo</p>

        <form onSubmit={handleLogin} className="auth-form">
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button className="btn primary">Login</button>
        </form>

        <div className="auth-actions">
          <Link to="/signup" className="link">Create account</Link>
          <button className="btn mini ghost" onClick={() => { setEmail("demo@predi.ai"); setPass("demo123"); }}>Use demo</button>
        </div>

        <div className="small">This is a frontend demo using mock data — you can plug in live APIs or model endpoints later.</div>
      </div>
    </div>
  );
}
