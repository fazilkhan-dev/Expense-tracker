const express = require("express");

const router = express.Router();

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

// ADD TRANSACTION
router.post("/", addTransaction);

// GET ALL TRANSACTIONS
router.get("/", getTransactions);

// GET SUMMARY
router.get("/summary", getSummary);

// UPDATE TRANSACTION
router.put("/:id", updateTransaction);

// DELETE TRANSACTION
router.delete("/:id", deleteTransaction);

module.exports = router;