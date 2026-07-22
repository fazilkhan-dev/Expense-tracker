import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { convertAmount, formatMoney } from "../utils/currency";

function SummaryCards({ transactions, displayCurrency }) {
  const convert = (item) =>
    convertAmount(item.amount, item.currency || "INR", displayCurrency);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + convert(item), 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + convert(item), 0);

  const balance = income - expense;

  return (
    <div className="summary-grid">
      <div className="summary-card balance-card">
        <div className="card-icon balance-icon">
          <Wallet size={34} />
        </div>

        <h3>Total Balance</h3>

        <h2 className="balance-text">
          {formatMoney(balance, displayCurrency)}
        </h2>

        <p className="card-subtitle">Available Balance</p>
      </div>

      <div className="summary-card income-card">
        <div className="card-icon income-icon">
          <TrendingUp size={34} />
        </div>

        <h3>Income</h3>

        <h2 className="income-text">
          {formatMoney(income, displayCurrency)}
        </h2>

        <p className="card-subtitle">Money Received</p>
      </div>

      <div className="summary-card expense-card">
        <div className="card-icon expense-icon">
          <TrendingDown size={34} />
        </div>

        <h3>Expense</h3>

        <h2 className="expense-text">
          {formatMoney(expense, displayCurrency)}
        </h2>

        <p className="card-subtitle">Money Spent</p>
      </div>
    </div>
  );
}

export default SummaryCards;