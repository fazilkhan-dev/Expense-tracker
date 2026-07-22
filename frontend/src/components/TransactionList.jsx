import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiCalendar, FiTag } from "react-icons/fi";
import { CURRENCY_SYMBOLS } from "../utils/currency";

function TransactionList({
  transactions,
  deleteTransaction,
  setEditingTransaction,
}) {
  return (
    <div className="transactions">
      <h2>Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="empty-text">No Transactions Found</p>
      ) : (
        transactions.map((item) => {
          const symbol = CURRENCY_SYMBOLS[item.currency || "INR"];

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className={`transaction-card ${
                item.type === "income"
                  ? "income-card-style"
                  : "expense-card-style"
              }`}
            >
              <div className="transaction-top">
                <div>
                  <h3>{item.title}</h3>

                  <div className="transaction-meta">
                    <div className="meta-chip">
                      <FiTag />
                      <span>{item.category}</span>
                    </div>

                    <div className="meta-chip">
                      <FiCalendar />
                      <span>
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className={`transaction-amount ${item.type}`}>
                  {item.type === "income" ? "+" : "-"}
                  {symbol}
                  {item.amount}
                </h2>
              </div>

              <div className="transaction-bottom">
                <div className="transaction-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => setEditingTransaction(item)}
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTransaction(item._id)}
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

export default TransactionList;