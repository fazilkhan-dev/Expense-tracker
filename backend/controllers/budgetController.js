const Budget = require("../models/Budget");

// CREATE OR UPDATE BUDGET FOR A CATEGORY
const createBudget = async (req, res) => {
  try {
    const { category, limitAmount, currency } = req.body;

    const existing = await Budget.findOne({ category });

    if (existing) {
      existing.limitAmount = limitAmount;
      existing.currency = currency || existing.currency;
      const updated = await existing.save();
      return res.status(200).json(updated);
    }

    const budget = await Budget.create({
      category,
      limitAmount,
      currency,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL BUDGETS
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ createdAt: -1 });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE BUDGET
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      message: "Budget deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  deleteBudget,
};