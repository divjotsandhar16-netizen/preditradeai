import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";

export default function StockChart({ data }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 18, left: -8, bottom: 10 }}>
          <defs>
            <linearGradient id="grad1" x1="0" x2="1">
              <stop offset="0%" stopColor="#00ffb2" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#3ba9ff" stopOpacity={0.85}/>
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#122032" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#9fb0d9", fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `₹${v}`} tick={{ fill: "#9fb0d9", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "#071022", border: "1px solid #13263f" }} />
          <Area type="monotone" dataKey="price" stroke="url(#grad1)" fill="url(#grad1)" fillOpacity={0.06} />
          <Line type="monotone" dataKey="price" stroke="url(#grad1)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
