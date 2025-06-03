import axios from "axios";

// create an instance

const api = axios.create({
  baseURL: "https://v6.exchangerate-api.com/v6/1eeccfb59edc61c8c944107e",
});

// get request

export const currencyConvertor = (fromCurrency, toCurrency, amount) => {
  return api.get(`/pair/${fromCurrency}/${toCurrency}/${amount}`);
};
