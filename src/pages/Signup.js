import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!email || !pass) return alert("Enter email & password");
    // store simple credential locally
    localStorage.setItem("pt_user", JSON.stringify({ email, pass }));
    alert("Signup complete — you can login now (or you are auto-logged in).");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="brand">PrediTrade<span className="accent">AI</span></h2>
        <p className="auth-sub">Create a free demo account</p>

        <form onSubmit={handleSignup} className="auth-form">
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button className="btn primary">Sign up</button>
        </form>

        <div className="auth-actions">
          <Link to="/" className="link">Already have an account? Login</Link>
        </div>

        <div className="small">We only store credentials locally for demo. Replace with backend auth in production.</div>
      </div>
    </div>
  );
}
