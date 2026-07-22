import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { motion } from "framer-motion";
import { convertAmount, formatMoney } from "../utils/currency";

function ExpenseChart({ transactions, displayCurrency }) {
  const convert = (item) =>
    convertAmount(item.amount, item.currency || "INR", displayCurrency);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + convert(item), 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + convert(item), 0);

  const total = income + expense;

  const overviewData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const overviewColors = ["#22c55e", "#ef4444"];

  // CATEGORY DATA
  const categoryMap = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      const amt = convert(item);

      if (!categoryMap[item.category]) {
        categoryMap[item.category] = 0;
      }

      categoryMap[item.category] += amt;
    });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const categoryColors = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
  ];

  return (
    <motion.div whileHover={{ scale: 1.01 }} className="chart-container">
      <div className="chart-header">
        <h2>Finance Overview</h2>
        <p>Total Flow : {formatMoney(total, displayCurrency)}</p>
      </div>

      {/* Income vs Expense */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={overviewData}
              innerRadius={90}
              outerRadius={120}
              dataKey="value"
              paddingAngle={4}
            >
              {overviewData.map((entry, index) => (
                <Cell key={index} fill={overviewColors[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="chart-center">
          <h3>{formatMoney(total, displayCurrency)}</h3>
          <p>Total</p>
        </div>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="income-dot"></span>
          <p>Income</p>
        </div>

        <div className="legend-item">
          <span className="expense-dot"></span>
          <p>Expense</p>
        </div>
      </div>

      {/* Category Chart */}
      <div className="category-chart-block">
        <h2 className="category-chart-title">
          Expense By Category
        </h2>

        {categoryData.length === 0 ? (
          <p style={{ textAlign: "center" }}>No expense transactions yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={categoryColors[index % categoryColors.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}

export default ExpenseChart;