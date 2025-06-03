import React, { useState } from "react";
import { currencyConvertor } from "./api/postApi";

export default function App() {
  const [currencyObj, setCurrencyObj] = useState({
    amount: 1,
    fromCurrency: "USD",
    toCurrency: "INR",
    convertedAmount: null,
    loading: false,
    error: null,
  });

  const handleConvertCurrency = async () => {
    setCurrencyObj((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await currencyConvertor(
        currencyObj.fromCurrency,
        currencyObj.toCurrency,
        currencyObj.amount
      );

      const { conversion_result } = res.data;

      setCurrencyObj((prev) => ({
        ...prev,
        convertedAmount: conversion_result,
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      setCurrencyObj((prev) => ({
        ...prev,
        error: "Error Converting Currency",
        loading: false,
      }));
    }
  };

  const { amount, fromCurrency, toCurrency, convertedAmount, loading, error } = currencyObj;

  return (
    <section className="currency-convertor">
      <div className="currency">
        <h1>Currency Convertor</h1>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setCurrencyObj((prev) => ({ ...prev, amount: e.target.value }))
              }
            />
          </label>
        </div>

        <div className="currency-selector">
          <label>
            From
            <select
              value={fromCurrency}
              onChange={(e) =>
                setCurrencyObj((prev) => ({ ...prev, fromCurrency: e.target.value }))
              }
            >
              {["USD", "INR", "GBP", "AUD"].map((cur, index) => (
                <option key={index} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="currency-selector">
          <label>
            To
            <select
              value={toCurrency}
              onChange={(e) =>
                setCurrencyObj((prev) => ({ ...prev, toCurrency: e.target.value }))
              }
            >
              {["INR", "USD", "GBP", "AUD"].map((cur, index) => (
                <option key={index} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          disabled={loading || amount <= 0}
          onClick={handleConvertCurrency}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>
      <hr />

      {convertedAmount && (
        <div>
          <h2>
            {amount} {fromCurrency} = {Number(convertedAmount).toFixed(2)} {toCurrency}
          </h2>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </section>
  );
}


/* import React, { useState } from "react";
import { currencyConvertor } from "./api/postApi";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  const [convertedAmount, setConvertedAmount] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConvertCurrency = async () => {
    setLoading(true);
    try {
      const res = await currencyConvertor(fromCurrency, toCurrency, amount);
      const { conversion_rate, conversion_result } = res.data;

      setConvertedAmount(conversion_result);
    } catch (error) {
      setError("Error Fetching Conversion Rate");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="currency-convertor">
      <div className="currency">
        <h1>Currency Convertor</h1>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
        </div>

        <div className="currency-selector">
          <label>
            From
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {["USD", "INR", "GBP", "AUD"].map((cur, index) => (
                <option key={index} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="currency-selector">
          <label>
            To
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {["INR", "USD", "GBP", "AUD"].map((cur, index) => (
                <option key={index} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          disabled={loading || amount <= 0}
          onClick={handleConvertCurrency}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>
      <hr />

      {convertedAmount && (
        <div>
          <h2>
            {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
          </h2>
        </div>
      )}

      {error && <p>{error}</p>}
    </section>
  );
}
 */



