import { useEffect, useState } from "react";
import "./index.css";


export default function App() {
  const [amount, setAmount] = useState("");
  const [first, setFirst] = useState("USD");
  const [second, setSecond] = useState("EUR");
  const [result, setResult] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currencies = {
    USD: { name: "US Dollar", symbol: "$" },
    PHP: { name: "Philippine Peso", symbol: "₱" },
    EUR: { name: "Euro", symbol: "€" },
    GBP: { name: "British Pound", symbol: "£" },
    JPY: { name: "Japanese Yen", symbol: "¥" },
    AUD: { name: "Australian Dollar", symbol: "A$" },
    CAD: { name: "Canadian Dollar", symbol: "C$" },
    CHF: { name: "Swiss Franc", symbol: "Fr" },
    CNY: { name: "Chinese Yuan", symbol: "¥" },
    THB: { name: "Thai Baht", symbol: "฿" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
    SGD: { name: "Singapore Dollar", symbol: "S$" },
    HKD: { name: "Hong Kong Dollar", symbol: "HK$" },
    KRW: { name: "South Korean Won", symbol: "₩" },
    BRL: { name: "Brazilian Real", symbol: "R$" },
    MXN: { name: "Mexican Peso", symbol: "Mex$" },
  };

  useEffect(() => {
    const fetchAPI = async () => {
      if (!amount || !first || !second) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${first}&to=${second}`
        );

        if (!res.ok) throw new Error("Failed to fetch exchange rate");

        const data = await res.json();
        setResult(data.rates[second]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchAPI, 500);
    return () => clearTimeout(timeoutId);
  }, [first, second, amount]);

  const handleSwapCurrencies = () => {
    setFirst(second);
    setSecond(first);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Currency Converter
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <select
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(currencies).map(([code, { name }]) => (
                  <option key={code} value={code}>
                    {code} - {name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwapCurrencies}
              className="mt-6 p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
            >
              ↔️
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <select
                value={second}
                onChange={(e) => setSecond(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(currencies).map(([code, { name }]) => (
                  <option key={code} value={code}>
                    {code} - {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {isLoading ? (
              <div className="text-center text-gray-600">Converting...</div>
            ) : amount ? (
              <div className="text-center space-y-2">
                <div className="text-lg">
                  {currencies[first].symbol}
                  {amount} {first}
                </div>
                <div className="text-gray-400">↓</div>
                <div className="text-2xl font-bold text-gray-800">
                  {currencies[second].symbol}
                  {Number(result).toFixed(2)} {second}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Enter an amount to convert
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
