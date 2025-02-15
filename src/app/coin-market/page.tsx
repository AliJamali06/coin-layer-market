"use client";
import { useEffect, useState } from "react";

export default function CoinMarket() {
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCoins = ["BTC", "BNB", "ETH", "XRP", "LTC", "SOL", "DOGE", "ADA"];

  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_COINLAYER_KEY;
    fetch(`https://api.coinlayer.com/api/live?access_key=${API_KEY}`)
      .then((res) => res.json())
      .then((json) => {
        console.log("🔎 API Response:", json.rates); // ✅ Debugging ke liye

        if (!json.rates) {
          setError("No data available from API");
          return;
        }

        // ✅ Sirf selected coins filter karo jo API ne diye hain
        const filteredData = Object.fromEntries(
          selectedCoins
            .map((coin) => [coin, json.rates[coin]])
            .filter(([, price]) => price !== undefined) // ✅ Sirf available coins rakhein
        ) as Record<string, number>;

        console.log("✅ Filtered Data:", filteredData); // Debugging ke liye

        if (Object.keys(filteredData).length < selectedCoins.length) {
          console.warn("⚠️ Some coins are missing from API response!");
        }

        setData(filteredData);
      })
      .catch(() => setError("Failed to fetch data"));
  }, []);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!data) return <p className="text-center text-gray-600 mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Crypto Market Rates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data).map(([coin, price]) => (
          <div key={coin} className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 text-center">
            <h2 className="text-xl font-semibold text-gray-800">{coin}</h2>
            <p className="text-2xl font-bold text-green-600 mt-2">${price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
