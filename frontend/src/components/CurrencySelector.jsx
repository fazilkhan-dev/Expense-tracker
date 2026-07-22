import { CURRENCIES } from "../utils/currency";

function CurrencySelector({ displayCurrency, setDisplayCurrency }) {
  return (
    <div className="currency-bar">
      <span>Display Currency</span>

      <select
        value={displayCurrency}
        onChange={(e) => setDisplayCurrency(e.target.value)}
      >
        {CURRENCIES.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CurrencySelector;