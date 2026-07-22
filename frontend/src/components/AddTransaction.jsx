import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CURRENCIES } from "../utils/currency";

function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function AddTransaction({
  addTransaction,
  editingTransaction,
  updateTransaction,
  transactions,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setDate(
        editingTransaction.date
          ? new Date(editingTransaction.date)
          : null
      );
      setCategory(editingTransaction.category);
      setCustomCategory("");
      setCurrency(editingTransaction.currency || "INR");
    }
  }, [editingTransaction]);

  // Build a de-duplicated list of past titles for suggestions
  const titleSuggestions = useMemo(() => {
    if (!transactions) return [];

    const seen = new Set();
    const list = [];

    transactions.forEach((item) => {
      const trimmed = (item.title || "").trim();

      if (trimmed && !seen.has(trimmed.toLowerCase())) {
        seen.add(trimmed.toLowerCase());
        list.push(trimmed);
      }
    });

    return list;
  }, [transactions]);

  const handleTitleChange = (e) => {
    setTitle(capitalizeFirstLetter(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCategory =
      category === "Others" ? customCategory : category;

    const transactionData = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      title,
      amount: Number(amount),
      type,
      date: date ? date.toLocaleDateString() : "",
      category: finalCategory,
      currency,
    };

    if (editingTransaction) {
      updateTransaction({
        ...transactionData,
        _id: editingTransaction._id,
      });
    } else {
      addTransaction(transactionData);
    }

    setTitle("");
    setAmount("");
    setType("income");
    setDate(null);
    setCategory("");
    setCustomCategory("");
    setCurrency("INR");
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <h2>
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <p>Keep your finances organized with every transaction.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            placeholder="Enter transaction title"
            value={title}
            onChange={handleTitleChange}
            list="title-suggestions"
            autoComplete="off"
          />

          <datalist id="title-suggestions">
            {titleSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>Amount</label>

          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Currency</label>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>

          <DatePicker
            selected={date}
            onChange={(selectedDate) => setDate(selectedDate)}
            placeholderText="Select Date"
            className="custom-date-picker"
          />
        </div>

        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
            <option value="Bills">Bills</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {category === "Others" && (
          <div className="form-group full-width">
            <label>Custom Category</label>

            <input
              type="text"
              placeholder="Enter Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}

        <div className="form-group full-width">
          <label>Transaction Type</label>

          <div className="type-selector">
            <button
              type="button"
              className={
                type === "income" ? "type-btn active income" : "type-btn"
              }
              onClick={() => setType("income")}
            >
              Income
            </button>

            <button
              type="button"
              className={
                type === "expense" ? "type-btn active expense" : "type-btn"
              }
              onClick={() => setType("expense")}
            >
              Expense
            </button>
          </div>
        </div>
      </div>

      <button className="submit-btn" type="submit">
        {editingTransaction ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
}

export default AddTransaction;