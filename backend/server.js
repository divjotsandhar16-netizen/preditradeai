import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Fetch historical + live stock data
app.get("/api/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
    const response = await axios.get(url);

    const result = response.data.chart.result[0];
    const meta = result.meta;
    const prices = result.indicators.quote[0];
    const timestamps = result.timestamp;

    if (!timestamps || !prices.close) {
      return res.status(404).json({ error: "No stock data found" });
    }

    const trendData = timestamps.map((t, i) => ({
      date: new Date(t * 1000).toLocaleDateString("en-IN"),
      price: prices.close[i],
    }));

    res.json({
      symbol: meta.symbol,
      name: meta.symbol,
      current: meta.regularMarketPrice || prices.close.at(-1),
      high: Math.max(...prices.high),
      low: Math.min(...prices.low),
      trendData,
    });
  } catch (error) {
    console.error("❌ Error fetching stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// ✅ Optional: Live data endpoint (alias)
app.get("/api/live/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
    const response = await axios.get(url);

    const result = response.data.chart.result[0];
    const meta = result.meta;
    const prices = result.indicators.quote[0];
    const timestamps = result.timestamp;

    if (!timestamps || !prices.close) {
      return res.status(404).json({ error: "No live data found" });
    }

    const trendData = timestamps.map((t, i) => ({
      time: new Date(t * 1000).toLocaleTimeString("en-IN"),
      price: prices.close[i],
    }));

    res.json({
      symbol: meta.symbol,
      current: meta.regularMarketPrice || prices.close.at(-1),
      high: Math.max(...prices.high),
      low: Math.min(...prices.low),
      trendData,
    });
  } catch (error) {
    console.error("❌ Error fetching live stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch live stock data" });
  }
});

// ✅ Server start
const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
