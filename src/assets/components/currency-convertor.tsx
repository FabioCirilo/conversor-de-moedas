import { useEffect, useState } from "react";
import CurrencyDropdowns from "./dropdowns";
import { HiArrowsRightLeft } from "react-icons/hi2";

export default function CurrencyConvertor() {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["USD"]
  );

  // Currency ->  "https://api.frankfurter.app/currencies" is a free API for foreign exchange rates
  const fetchCurrencies = async () => {
    try {
      const response = await fetch("https://api.frankfurter.app/currencies");
      const data = await response.json();
      setCurrencies(Object.keys(data));
    } catch (err) {
      console.error("Err Fetching", err);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  console.log(currencies);

  // Convertor -> "https://api.frankfurter.app/latest?amount=1&from=USD&to=INR" is a free API for currency conversion
  const currencyConvertor = async () => {
    if (!amount) return;
    setConverting(true);

    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();
      setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
    } catch (err) {
      console.error("Err Fetching", err);
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updateFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updateFavorites = updateFavorites.filter((fav) => fav !== currency);
    } else {
      updateFavorites.push(currency);
    }
    setFavorites(updateFavorites);
    localStorage.setItem("favorites", JSON.stringify(updateFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-lg">
      <h1 className="mb-5 text-2xl font-semibold text-gray-700">
        Conversor de Moedas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <CurrencyDropdowns
          favorites={favorites}
          currencies={currencies}
          title="De"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          handleFavorite={handleFavorite}
        />
        {/* Swap Currency */}
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
          >
            <HiArrowsRightLeft className="text-xl text-gray-700" />
          </button>
        </div>

        <CurrencyDropdowns
          favorites={favorites}
          currencies={currencies}
          currency={toCurrency}
          setCurrency={setToCurrency}
          title="Para"
          handleFavorite={handleFavorite}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Quantia
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={currencyConvertor}
          className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-ring-offset-2
            ${converting ? "animate-pulse" : ""}`}
        >
          Conversor
        </button>
      </div>

      {convertedAmount && (
        <div className="mt-4 text-lg font-semibold text-right text-green-600">
          Valor convertido: {convertedAmount}
        </div>
      )}
    </div>
  );
}
