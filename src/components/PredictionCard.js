import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function PredictionCard({ predictedPrice, recommendation, pctChange }) {
  return (
    <div className="prediction-panel">
      <div className="pred-head">
        <h3>Prediction</h3>
        <div className={`pred-badge ${recommendation?.toLowerCase()}`}>
          {recommendation === "Buy" && <FiTrendingUp />}
          {recommendation === "Sell" && <FiTrendingDown />}
          <span>{recommendation ?? "Hold"}</span>
        </div>
      </div>

      <div className="pred-body">
        <div className="pred-row">
          <div className="pred-label">Next Estimated</div>
          <div className="pred-value">₹{predictedPrice ?? "—"}</div>
        </div>
        <div className="pred-row">
          <div className="pred-label">Expected Δ</div>
          <div className="pred-value">{pctChange ? `${pctChange}%` : "—"}</div>
        </div>
        <div className="pred-note">Note: This is a simple demo estimator — replace with model/API for production.</div>
      </div>
    </div>
  );
}
