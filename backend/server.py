from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/api/live/<string:symbol>', methods=['GET'])
def get_live_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d", interval="1m")
        if data.empty:
            return jsonify({"error": "No data found"}), 404

        chart_data = [
            {"time": str(index), "price": row["Close"]}
            for index, row in data.iterrows()
        ]

        current_price = round(data["Close"].iloc[-1], 2)
        high_price = round(data["High"].max(), 2)
        low_price = round(data["Low"].min(), 2)

        return jsonify({
            "symbol": symbol,
            "current": current_price,
            "high": high_price,
            "low": low_price,
            "chartData": chart_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)
