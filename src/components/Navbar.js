import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("pt_user");
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="brand-left">
        <Link to="/dashboard" className="brand-link">
          <div className="brand-title">PrediTrade<span className="accent">AI</span></div>
          <div className="brand-sub">Stock Forecast & Insights</div>
        </Link>
      </div>

      <div className="nav-right">
        <div className="user-pill">👋 {user}</div>
        <button className="btn small outline" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
