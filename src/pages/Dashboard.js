import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StockChart from "../components/StockChart";
import StockCard from "../components/StockCard";
import PredictionCard from "../components/PredictionCard";
import { SAMPLE_STOCKS } from "../data/sampleData";
import { FiSearch } from "react-icons/fi";

/* Simple linear estimator. For production, replace with ML model endpoint */
function estimateNext(series, lookback = 8) {
  if (!series || series.length < 3) return { predictedPrice: null, recommendation: "Hold", pctChange: null };
  const n = Math.min(lookback, series.length);
  const xs = [], ys = [];
  for (let i = series.length - n; i < series.length; i++) {
    xs.push(i);
    ys.push(series[i].price);
  }
  const xMean = xs.reduce((a,b)=>a+b,0)/xs.length;
  const yMean = ys.reduce((a,b)=>a+b,0)/ys.length;
  let num=0, den=0;
  for (let i=0;i<xs.length;i++){ num += (xs[i]-xMean)*(ys[i]-yMean); den += (xs[i]-xMean)**2; }
  const slope = den === 0 ? 0 : num/den;
  const pred = series[series.length-1].price + slope;
  const pct = ((pred - series[series.length-1].price) / series[series.length-1].price) * 100;
  let rec = "Hold";
  if (pct > 0.6) rec = "Buy";
  if (pct < -0.6) rec = "Sell";
  return { predictedPrice: parseFloat(pred.toFixed(2)), recommendation: rec, pctChange: parseFloat(pct.toFixed(2)) };
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("pt_user"))?.email ?? "Guest";

  const [stockKey, setStockKey] = useState("RELIANCE");
  const [range, setRange] = useState(30);
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState(SAMPLE_STOCKS.RELIANCE);

  useEffect(() => {
    // update series when stockKey changes
    const s = SAMPLE_STOCKS[stockKey] || (() => {
      const gen = require("../data/sampleData").generateSeries;
      return gen ? gen(90, 300 + Math.random()*1000, (Math.random()-0.5)*0.002) : SAMPLE_STOCKS.RELIANCE;
    })();

    setSeries(s);
  }, [stockKey]);

  // sliced data for chosen range
  const sliced = useMemo(() => series.slice(Math.max(0, series.length - range)), [series, range]);

  const prices = sliced.map(d => d.price);
  const high = Math.max(...prices).toFixed(2);
  const low = Math.min(...prices).toFixed(2);
  const avg = (prices.reduce((a,b)=>a+b,0)/prices.length).toFixed(2);
  const latest = prices[prices.length-1].toFixed(2);
  const changePct = (((latest - prices[0]) / prices[0]) * 100).toFixed(2);

  const prediction = estimateNext(series, 8);

  function handleSearch(e) {
    e.preventDefault();
    const key = query.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!key) return;
    if (SAMPLE_STOCKS[key]) {
      setStockKey(key);
      setQuery("");
    } else {
      // create a mock entry on the fly for any ticker typed
      SAMPLE_STOCKS[key] = (() => {
        // small generator to create plausible series
        const arr = [];
        let start = 300 + Math.random()*2000;
        for (let i=89; i>=0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          start = Math.max(1, start * (1 + (Math.random() - 0.48)*0.006));
          arr.push({ date: `${d.getDate()}/${d.getMonth()+1}`, price: parseFloat(start.toFixed(2)), volume: Math.floor(5000 + Math.random()*90000) });
        }
        return arr;
      })();
      setStockKey(key);
      setQuery("");
    }
  }

  return (
    <div className="app-shell">
      <Navbar user={user} />
      <main className="main-grid">
        <section className="panel left">
          <div className="search-row">
            <form onSubmit={handleSearch} className="search-box">
              <FiSearch className="search-icon" />
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search ticker (e.g. RELIANCE, TCS)" />
              <button className="btn small" type="submit">Search</button>
            </form>

            <div className="range-group">
              <label>Range</label>
              <select value={range} onChange={(e)=>setRange(parseInt(e.target.value))}>
                <option value={7}>7d</option>
                <option value={14}>14d</option>
                <option value={30}>30d</option>
                <option value={60}>60d</option>
                <option value={90}>90d</option>
              </select>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-head">
              <div>
                <h2 className="stock-name">{stockKey}</h2>
                <div className="stock-meta">Latest: <span className="meta-strong">₹{latest}</span> · {changePct}% ({range}d)</div>
              </div>
              <div className="mini-stats">
                <div className={`trend-pill ${prediction.recommendation?.toLowerCase()}`}>
                  {prediction.recommendation} {prediction.pctChange >= 0 ? `+${prediction.pctChange}%` : `${prediction.pctChange}%`}
                </div>
                <div className="next-est">Next est: ₹{prediction.predictedPrice}</div>
              </div>
            </div>

            <StockChart data={sliced} />
          </div>

          <div className="stats-row">
            <StockCard title="High (range)" value={high} foot="Max in selected window" positive={true} />
            <StockCard title="Low (range)" value={low} foot="Min in selected window" positive={false} />
            <StockCard title="Average" value={avg} foot="Mean price" />
          </div>
        </section>

        <aside className="panel right">
          <div className="side-card">
            <h3>Daily Overview</h3>
            <div className="overview-item">
              <div>Open</div><div>₹{(sliced[0]?.price ?? latest)}</div>
            </div>
            <div className="overview-item">
              <div>Close</div><div>₹{latest}</div>
            </div>
            <div className="overview-item">
              <div>Change</div><div className={changePct>=0 ? "pos" : "neg"}>{changePct}%</div>
            </div>
            <div className="overview-item">
              <div>Volume (last)</div><div>{sliced[sliced.length-1]?.volume ?? "—"}</div>
            </div>
          </div>

          <PredictionCard predictedPrice={prediction.predictedPrice} recommendation={prediction.recommendation} pctChange={prediction.pctChange} />

          <div className="side-card">
            <h3>Quick Actions</h3>
            <button className="btn primary block">Simulate Buy</button>
            <button className="btn ghost block">Simulate Sell</button>
            <button className="btn outline block" onClick={()=>{ alert("Export CSV (demo) — implement server/export logic"); }}>Export CSV</button>
          </div>

          <div className="footer-note">
            <small>Tip: Replace the sampleData with live API (eg. AlphaVantage / Yahoo Finance / NSE endpoint) and replace estimator with your ML model API for production-grade predictions.</small>
          </div>
        </aside>
      </main>
    </div>
  );
}

