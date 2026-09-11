const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
	getTransactions,
	getSummary,
	getCategorySummary,
	getMonthlySummary,
	createTransaction,
	getTransaction,
	updateTransaction,
	deleteTransaction
} = require("../controllers/transactionController");

const router = express.Router();
router.use(authenticate);

// Add transaction
router.get("/", getTransactions);
router.post("/", createTransaction);

// Dashboard summaries
router.get("/summary", getSummary);
router.get("/summary/categories", getCategorySummary);
router.get("/summary/monthly", getMonthlySummary);

// Get single transaction
router.get("/:transactionId", getTransaction);

// Update transaction
router.put("/:transactionId", updateTransaction);

// Delete transaction
router.delete("/:transactionId", deleteTransaction);

module.exports = router;