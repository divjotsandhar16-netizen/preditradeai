// sampleData.js
// Generates mock time series data for demo. Replace with real API later.
function generateSeries(days = 60, start = 500, drift = 0.001) {
  const out = [];
  let price = start;
  for (let i = days - 1; i >= 0; i--) {
    const noise = (Math.random() - 0.5) * start * 0.015; // ~1.5% noise
    price = Math.max(1, price * (1 + drift) + noise);
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    out.push({ date: label, price: parseFloat(price.toFixed(2)), volume: Math.floor(10000 + Math.random() * 90000) });
  }
  return out;
}

export const SAMPLE_STOCKS = {
  RELIANCE: generateSeries(90, 2400, 0.0012),
  TCS: generateSeries(90, 3200, -0.0003),
  INFY: generateSeries(90, 1500, 0.0008),
  HDFCBANK: generateSeries(90, 1600, 0.0004),
  TATASTEEL: generateSeries(90, 140, -0.0005),
};

