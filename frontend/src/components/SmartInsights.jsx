import { Lightbulb } from "lucide-react";
import { convertAmount, formatMoney } from "../utils/currency";

function SmartInsights({ transactions, budgets, displayCurrency }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const inMonth = (item, month, year) => {
    const d = new Date(item.date || item.createdAt);
    return d.getMonth() === month && d.getFullYear() === year;
  };

  const convert = (item) =>
    convertAmount(item.amount, item.currency || "INR", displayCurrency);

  const currentMonthExpense = transactions
    .filter((t) => t.type === "expense" && inMonth(t, currentMonth, currentYear))
    .reduce((acc, t) => acc + convert(t), 0);

  const lastMonthExpense = transactions
    .filter((t) => t.type === "expense" && inMonth(t, lastMonth, lastMonthYear))
    .reduce((acc, t) => acc + convert(t), 0);

  const currentMonthIncome = transactions
    .filter((t) => t.type === "income" && inMonth(t, currentMonth, currentYear))
    .reduce((acc, t) => acc + convert(t), 0);

  const savings = currentMonthIncome - currentMonthExpense;

  const categoryTotals = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + convert(t);
    });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const insights = [];

  if (lastMonthExpense > 0) {
    const changePercent =
      ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;

    if (changePercent > 5) {
      insights.push(`You spent ${changePercent.toFixed(0)}% more than last month.`);
    } else if (changePercent < -5) {
      insights.push(
        `You spent ${Math.abs(changePercent).toFixed(0)}% less than last month. Nice work.`
      );
    }
  }

  if (topCategory) {
    insights.push(
      `${topCategory[0]} is your highest expense category at ${formatMoney(
        topCategory[1],
        displayCurrency
      )}.`
    );
  }

  if (savings > 0) {
    insights.push(`You saved ${formatMoney(savings, displayCurrency)} this month.`);
  } else if (savings < 0) {
    insights.push(
      `You spent ${formatMoney(Math.abs(savings), displayCurrency)} more than you earned this month.`
    );
  }

  budgets.forEach((budget) => {
    const limitInDisplay = convertAmount(
      budget.limitAmount,
      budget.currency || "INR",
      displayCurrency
    );

    const spent = categoryTotals[budget.category] || 0;

    if (spent > limitInDisplay) {
      insights.push(`${budget.category} exceeded your budget.`);
    }
  });

  return (
    <div className="insights-card">
      <div className="insights-header">
        <Lightbulb size={22} />
        <h2>Smart Insights</h2>
      </div>

      {insights.length === 0 ? (
        <p className="empty-text">Add more transactions to unlock insights.</p>
      ) : (
        <ul className="insights-list">
          {insights.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SmartInsights;