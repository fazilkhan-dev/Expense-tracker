import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { convertAmount, formatMoney, CURRENCIES } from "../utils/currency";

const CATEGORY_OPTIONS = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Salary",
  "Bills",
  "Others",
];

function BudgetPlanner({
  budgets,
  transactions,
  displayCurrency,
  addBudget,
  deleteBudget,
}) {
  const [category, setCategory] = useState("Food");
  const [limitAmount, setLimitAmount] = useState("");
  const [currency, setCurrency] = useState("INR");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!limitAmount) return;

    addBudget({
      category,
      limitAmount: Number(limitAmount),
      currency,
    });

    setLimitAmount("");
  };

  const getSpent = (budgetCategory) => {
    return transactions
      .filter(
        (item) => item.type === "expense" && item.category === budgetCategory
      )
      .reduce((acc, item) => {
        return (
          acc + convertAmount(item.amount, item.currency || "INR", displayCurrency)
        );
      }, 0);
  };

  return (
    <div className="budget-planner">
      <div className="budget-form-card">
        <h2>Set a Budget</h2>

        <form onSubmit={handleSubmit} className="budget-form">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Limit amount"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
          />

          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <button type="submit">Add Budget</button>
        </form>
      </div>

      <div className="budget-list">
        {budgets.length === 0 ? (
          <p className="empty-text">No budgets set yet.</p>
        ) : (
          budgets.map((budget) => {
            const limitInDisplay = convertAmount(
              budget.limitAmount,
              budget.currency || "INR",
              displayCurrency
            );

            const spent = getSpent(budget.category);
            const percent = Math.min((spent / limitInDisplay) * 100, 100);
            const remaining = limitInDisplay - spent;
            const isWarning = spent >= limitInDisplay * 0.9;
            const isOver = spent > limitInDisplay;

            return (
              <motion.div
                key={budget._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`budget-card ${isOver ? "budget-over" : ""}`}
              >
                <div className="budget-card-top">
                  <h3>{budget.category}</h3>

                  <button
                    className="budget-delete"
                    onClick={() => deleteBudget(budget._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="budget-progress-track">
                  <div
                    className={`budget-progress-fill ${
                      isOver ? "fill-danger" : isWarning ? "fill-warning" : "fill-ok"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="budget-meta">
                  <span>
                    {formatMoney(spent, displayCurrency)} spent of{" "}
                    {formatMoney(limitInDisplay, displayCurrency)}
                  </span>

                  <span className={remaining < 0 ? "text-danger" : "text-ok"}>
                    {remaining < 0
                      ? `Over by ${formatMoney(Math.abs(remaining), displayCurrency)}`
                      : `${formatMoney(remaining, displayCurrency)} left`}
                  </span>
                </div>

                {isWarning && (
                  <div className="budget-warning">
                    <AlertTriangle size={14} />
                    {isOver ? "Budget exceeded!" : "Approaching your limit"}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BudgetPlanner;