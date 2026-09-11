const mongoose = require("mongoose");
const Budget = require("../models/budget");
const Transaction = require("../models/transaction");

const isValidId = (value) => mongoose.Types.ObjectId.isValid(value);

const parseDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toDateBoundary = (value, isStart) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  if (isStart) {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  date.setHours(23, 59, 59, 999);
  return date;
};

const validateBudgetInput = (body = {}) => {
  const { amount, startDate, endDate, description = "" } = body;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return "Amount must be greater than 0";
  }

  const parsedStart = parseDate(startDate);
  const parsedEnd = parseDate(endDate);

  if (!parsedStart) return "Start date is invalid";
  if (!parsedEnd) return "End date is invalid";
  if (parsedEnd < parsedStart) return "End date must not be before start date";
  if (typeof description !== "string" || description.length > 300) return "Description must be 300 characters or fewer";

  return null;
};

const getBudgetSpent = async (userId, startDate, endDate) => {
  const start = toDateBoundary(startDate, true);
  const end = toDateBoundary(endDate, false);

  if (!start || !end) return 0;

  const result = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: "expense",
        date: {
          $gte: start,
          $lte: end
        }
      }
    },
    {
      $group: {
        _id: null,
        spent: { $sum: "$amount" }
      }
    }
  ]);

  return Number(result[0]?.spent || 0);
};

const decorateBudget = async (budget, userId) => {
  const amount = Number(budget.amount) || 0;
  const spent = await getBudgetSpent(userId, budget.startDate, budget.endDate);
  const remaining = amount - spent;
  const percentageUsed = amount > 0 ? (spent / amount) * 100 : 0;

  return {
    id: String(budget._id),
    amount,
    startDate: budget.startDate,
    endDate: budget.endDate,
    description: budget.description || "",
    spent,
    remaining,
    percentageUsed,
    isExceeded: spent > amount
  };
};

const hasOverlappingBudget = async (userId, startDate, endDate, excludeId = null) => {
  const query = {
    userId,
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) }
  };

  if (excludeId) query._id = { $ne: excludeId };

  const existing = await Budget.findOne(query).select("_id");
  return Boolean(existing);
};

const handleError = (res, error, action) => {
  if (error.code === 11000) {
    return res.status(409).json({ error: "A budget already exists for this date range." });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: "Invalid budget data" });
  }

  console.error(`${action} failed:`, error.message);
  return res.status(500).json({ error: `Unable to ${action.toLowerCase()}` });
};

const createBudget = async (req, res) => {
  const validationError = validateBudgetInput(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const { amount, startDate, endDate, description = "" } = req.body;
    const start = toDateBoundary(startDate, true);
    const end = toDateBoundary(endDate, false);

    if (!start || !end) {
      return res.status(400).json({ error: "Invalid budget dates" });
    }

    if (await hasOverlappingBudget(req.user._id, start, end)) {
      return res.status(409).json({ error: "A budget already exists for this date range." });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      amount: Number(amount),
      startDate: start,
      endDate: end,
      description
    });

    return res.status(201).json({ budget: await decorateBudget(budget, req.user._id) });
  } catch (error) {
    return handleError(res, error, "Create budget");
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ startDate: -1 });
    const decorated = await Promise.all(budgets.map((budget) => decorateBudget(budget, req.user._id)));
    return res.status(200).json({ budgets: decorated });
  } catch (error) {
    return handleError(res, error, "Retrieve budgets");
  }
};

const getBudgetById = async (req, res) => {
  if (!isValidId(req.params.budgetId)) return res.status(400).json({ error: "Invalid budget ID" });

  try {
    const budget = await Budget.findOne({ _id: req.params.budgetId, userId: req.user._id });
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    return res.status(200).json({ budget: await decorateBudget(budget, req.user._id) });
  } catch (error) {
    return handleError(res, error, "Retrieve budget");
  }
};

const updateBudget = async (req, res) => {
  if (!isValidId(req.params.budgetId)) return res.status(400).json({ error: "Invalid budget ID" });

  try {
    const budget = await Budget.findOne({ _id: req.params.budgetId, userId: req.user._id });
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    const next = {
      amount: req.body.amount ?? budget.amount,
      startDate: req.body.startDate ?? budget.startDate,
      endDate: req.body.endDate ?? budget.endDate,
      description: req.body.description ?? budget.description
    };

    const nextStart = toDateBoundary(next.startDate, true);
    const nextEnd = toDateBoundary(next.endDate, false);
    if (!nextStart || !nextEnd) {
      return res.status(400).json({ error: "Invalid budget dates" });
    }

    const validationError = validateBudgetInput(next);
    if (validationError) return res.status(400).json({ error: validationError });

    if (await hasOverlappingBudget(req.user._id, nextStart, nextEnd, budget._id)) {
      return res.status(409).json({ error: "A budget already exists for this date range." });
    }

    Object.assign(budget, next);
    await budget.save();

    return res.status(200).json({ budget: await decorateBudget(budget, req.user._id) });
  } catch (error) {
    return handleError(res, error, "Update budget");
  }
};

const deleteBudget = async (req, res) => {
  if (!isValidId(req.params.budgetId)) return res.status(400).json({ error: "Invalid budget ID" });

  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.budgetId, userId: req.user._id });
    if (!budget) return res.status(404).json({ error: "Budget not found" });
    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    return handleError(res, error, "Delete budget");
  }
};

module.exports = { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget };
