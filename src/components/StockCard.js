import React from "react";

export default function StockCard({ title, value, foot, positive }) {
  return (
    <div className={`stat-card ${positive === undefined ? "" : positive ? "pos" : "neg"}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">₹{value}</div>
      {foot && <div className="stat-foot">{foot}</div>}
    </div>
  );
}
