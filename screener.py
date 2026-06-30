import pandas as pd
import yfinance as yf 

stocks = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "JNJ","WMT","MA","ORCL","KO","NFLX"]
data = []

for ticker in stocks:
    stock = yf.Ticker(ticker)

    info = stock.info

    data.append({
        "Ticker": ticker,
        "PE Ratio": info.get("trailingPE"),
        "Market Cap": info.get("marketCap"),
        "Revenue Growth": info.get("revenueGrowth"),
        "Current Price": info.get("currentPrice"),
        "52 Week High": info.get("fiftyTwoWeekHigh"),
        "52 Week Low": info.get("fiftyTwoWeekLow"),
        "Sector": info.get("sector"),
        "Industry": info.get("industry")
    })

df = pd.DataFrame(data)

df = df.dropna(subset=["PE Ratio", "Market Cap"])

filtered = df[
    (df["PE Ratio"] < 30) &
    (df["Market Cap"] > 1e9)
].copy()

filtered["Score"] = (

    ((30 - filtered["PE Ratio"]).clip(lower=0) / 30) * 40 +

    (filtered["Revenue Growth"].clip(lower=0) * 100 / 40).clip(upper=1) * 40 +

    ((filtered["Market Cap"] / 1e12).clip(upper=2) / 2) * 20

).round(1)

filtered = filtered.sort_values("Score", ascending=False)
filtered.to_json("stocks.json", orient="records")
print("Data exported to stocks.json")
