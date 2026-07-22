import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";

import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import SummaryCards from "./components/SummaryCards";
import AddTransaction from "./components/AddTransaction";
import TransactionList from "./components/TransactionList";
import ExpenseChart from "./components/ExpenseChart";
import CurrencySelector from "./components/CurrencySelector";
import BudgetPlanner from "./components/BudgetPlanner";
import SmartInsights from "./components/SmartInsights";

import API, { budgetAPI } from "./api";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [popup, setPopup] = useState(null);

  const [editingTransaction, setEditingTransaction] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterType, setFilterType] = useState("all");

  const [sortBy, setSortBy] = useState("latest");

  const [darkMode, setDarkMode] = useState(true);

  const [glowEffect, setGlowEffect] = useState(true);

  const [transactions, setTransactions] = useState([]);

  const [budgets, setBudgets] = useState([]);

  const [displayCurrency, setDisplayCurrency] = useState("INR");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/");
      setTransactions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await budgetAPI.get("/");
      setBudgets(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const addTransaction = async (newTransaction) => {
    try {
      const res = await API.post("/", newTransaction);

      setTransactions([res.data, ...transactions]);

      setPopup({
        amount: newTransaction.amount,
        type: newTransaction.type,
      });

      setTimeout(() => {
        setPopup(null);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/${id}`);

      const updatedTransactions = transactions.filter(
        (item) => item._id !== id
      );

      setTransactions(updatedTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      const res = await API.put(
        `/${updatedTransaction._id}`,
        updatedTransaction
      );

      const updatedTransactions = transactions.map((item) =>
        item._id === updatedTransaction._id ? res.data : item
      );

      setTransactions(updatedTransactions);

      setEditingTransaction(null);
    } catch (error) {
      console.log(error);
    }
  };

  const addBudget = async (newBudget) => {
    try {
      const res = await budgetAPI.post("/", newBudget);

      const exists = budgets.find((b) => b._id === res.data._id);

      if (exists) {
        setBudgets(
          budgets.map((b) => (b._id === res.data._id ? res.data : b))
        );
      } else {
        setBudgets([res.data, ...budgets]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBudget = async (id) => {
    try {
      await budgetAPI.delete(`/${id}`);

      setBudgets(budgets.filter((b) => b._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTransactions = transactions
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterType === "all" ? true : item.type === filterType;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "highest") {
        return b.amount - a.amount;
      }

      if (sortBy === "lowest") {
        return a.amount - b.amount;
      }

      return 0;
    });

  return (
    <div className="container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <Navbar />

      <CurrencySelector
        displayCurrency={displayCurrency}
        setDisplayCurrency={setDisplayCurrency}
      />

      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
            className={`money-popup ${
              popup.type === "income" ? "popup-income" : "popup-expense"
            }`}
          >
            {popup.type === "income" ? "+" : "-"} ₹{popup.amount}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-content">
        <AnimatePresence mode="wait">
          {activeSection === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="dashboard section-fade"
            >
              <div className="left-panel">
                <SummaryCards
                  transactions={transactions}
                  displayCurrency={displayCurrency}
                />

<AddTransaction
                  addTransaction={addTransaction}
                  editingTransaction={editingTransaction}
                  updateTransaction={updateTransaction}
                  transactions={transactions}
                />
              </div>

              <div className="right-panel">
                <ExpenseChart
                  transactions={transactions}
                  displayCurrency={displayCurrency}
                />

                <div className="transactions search-box">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Transactions</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                  </select>
                </div>

                <TransactionList
                  transactions={filteredTransactions}
                  deleteTransaction={deleteTransaction}
                  setEditingTransaction={setEditingTransaction}
                />
              </div>
            </motion.div>
          )}

          {activeSection === "transactions" && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="full-section section-fade"
            >
              <TransactionList
                transactions={filteredTransactions}
                deleteTransaction={deleteTransaction}
                setEditingTransaction={setEditingTransaction}
              />
            </motion.div>
          )}

          {activeSection === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="full-section section-fade"
            >
              <ExpenseChart
                transactions={transactions}
                displayCurrency={displayCurrency}
              />
            </motion.div>
          )}

          {activeSection === "budget" && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="full-section section-fade budget-section"
            >
              <SmartInsights
                transactions={transactions}
                budgets={budgets}
                displayCurrency={displayCurrency}
              />

              <BudgetPlanner
                budgets={budgets}
                transactions={transactions}
                displayCurrency={displayCurrency}
                addBudget={addBudget}
                deleteBudget={deleteBudget}
              />
            </motion.div>
          )}

          {activeSection === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="full-section settings-section section-fade"
            >
              <h1>Settings</h1>

              <div className="settings-grid">
                <div className="setting-card">
                  <h3>Dark Mode</h3>
                  <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "Disable" : "Enable"}
                  </button>
                </div>

                <div className="setting-card">
                  <h3>Glow Effects</h3>
                  <button onClick={() => setGlowEffect(!glowEffect)}>
                    {glowEffect ? "Disable" : "Enable"}
                  </button>
                </div>

                <div className="setting-card">
                  <h3>Reset Transactions</h3>
                  <button
                    className="danger-btn"
                    onClick={() => setTransactions([])}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;