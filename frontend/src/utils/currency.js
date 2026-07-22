export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];

export const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

// Static approximate rates (1 unit of currency = X INR).
// Swap this for a live rates API later if needed.
const RATE_TO_INR = {
  INR: 1,
  USD: 83,
  EUR: 90,
  GBP: 105,
  JPY: 0.56,
};

export function convertAmount(amount, fromCurrency, toCurrency) {
  const from = fromCurrency || "INR";
  const to = toCurrency || "INR";

  if (from === to) return amount;

  const amountInINR = amount * (RATE_TO_INR[from] || 1);
  const converted = amountInINR / (RATE_TO_INR[to] || 1);

  return converted;
}

export function formatMoney(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";

  const rounded =
    currency === "JPY"
      ? Math.round(amount)
      : Math.round(amount * 100) / 100;

  return `${symbol}${rounded.toLocaleString()}`;
}