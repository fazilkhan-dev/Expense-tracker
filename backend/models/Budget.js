const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },

    limitAmount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP", "JPY"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Budget", budgetSchema);