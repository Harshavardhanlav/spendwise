const mongoose = require("mongoose");
const Transaction = require("../models/transaction");

const paymentMethods = [
	"Cash",
	"UPI",
	"Debit Card",
	"Credit Card",
	"Bank Transfer",
	"Net Banking",
	"Other"
];

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const parseDate = (value) => {
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? null : value;
	}

	if (typeof value !== "string" && typeof value !== "number") {
		return null;
	}

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

const findUserCategory = (user, categoryId) => {
	if (!isValidObjectId(categoryId)) {
		return null;
	}

	return user.categories.id(categoryId);
};

const validateTransactionFields = ({ type, categoryId, title, amount, date, paymentMethod }, user) => {
	if (!['income', 'expense'].includes(type)) {
		return "Transaction type must be income or expense";
	}

	if (!categoryId || !findUserCategory(user, categoryId)) {
		return "Category not found";
	}

	if (typeof title !== "string" || !title.trim()) {
		return "Transaction title is required";
	}

	if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
		return "Amount must be a valid number greater than or equal to 0";
	}

	if (!parseDate(date)) {
		return "Transaction date is invalid";
	}

	if (!paymentMethods.includes(paymentMethod)) {
		return "Payment method is invalid";
	}

	return null;
};

const handleDatabaseError = (res, error, action) => {
	if (error.name === "ValidationError") {
		return res.status(400).json({ error: "Invalid transaction data" });
	}

	console.error(`${action} failed:`, error.message);
	return res.status(500).json({ error: `Unable to ${action.toLowerCase()}` });
};

const buildTransactionQuery = (req) => {
	const query = { userId: req.user._id };
	const { type, categoryId, startDate, endDate } = req.query;

	if (type !== undefined) {
		if (!['income', 'expense'].includes(type)) {
			return { error: "Transaction type must be income or expense" };
		}
		query.type = type;
	}

	if (categoryId !== undefined) {
		if (!isValidObjectId(categoryId)) {
			return { error: "Invalid category ID" };
		}
		if (!findUserCategory(req.user, categoryId)) {
			return { status: 404, error: "Category not found" };
		}
		query.categoryId = categoryId;
	}

	if (startDate !== undefined || endDate !== undefined) {
		query.date = {};
		if (startDate !== undefined) {
			const parsedStartDate = parseDate(startDate);
			if (!parsedStartDate) {
				return { error: "Start date is invalid" };
			}
			query.date.$gte = parsedStartDate;
		}
		if (endDate !== undefined) {
			const parsedEndDate = parseDate(endDate);
			if (!parsedEndDate) {
				return { error: "End date is invalid" };
			}

			if (typeof endDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
				const exclusiveEndDate = new Date(parsedEndDate);
				exclusiveEndDate.setUTCDate(exclusiveEndDate.getUTCDate() + 1);
				query.date.$lt = exclusiveEndDate;
			} else {
				query.date.$lte = parsedEndDate;
			}
		}

		if (query.date.$gte && query.date.$lt && query.date.$gte >= query.date.$lt) {
			return { error: "Start date must not be after end date" };
		}
		if (query.date.$gte && query.date.$lte && query.date.$gte > query.date.$lte) {
			return { error: "Start date must not be after end date" };
		}
	}

	return { query };
};

const getTransactions = async (req, res) => {
	try {
		const filterResult = buildTransactionQuery(req);
		if (filterResult.error) {
			return res.status(filterResult.status || 400).json({ error: filterResult.error });
		}

		const transactions = await Transaction.find(filterResult.query).sort({ date: -1 });
		return res.status(200).json({ transactions });
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve transactions");
	}
};

const getSummary = async (req, res) => {
	try {
		const result = await Transaction.aggregate([
			{ $match: { userId: req.user._id } },
			{
				$group: {
					_id: null,
					totalIncome: {
						$sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
					},
					totalExpense: {
						$sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
					},
					totalTransactions: { $sum: 1 },
					incomeTransactionCount: {
						$sum: { $cond: [{ $eq: ["$type", "income"] }, 1, 0] }
					},
					expenseTransactionCount: {
						$sum: { $cond: [{ $eq: ["$type", "expense"] }, 1, 0] }
					}
				}
			}
		]);

		const summary = result[0] || {
			totalIncome: 0,
			totalExpense: 0,
			totalTransactions: 0,
			incomeTransactionCount: 0,
			expenseTransactionCount: 0
		};
		const { _id, ...totals } = summary;

		return res.status(200).json({
			...totals,
			balance: totals.totalIncome - totals.totalExpense
		});
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve transaction summary");
	}
};

const getCategorySummary = async (req, res) => {
	try {
		const result = await Transaction.aggregate([
			{ $match: { userId: req.user._id, type: "expense" } },
			{
				$group: {
					_id: "$categoryId",
					totalAmount: { $sum: "$amount" },
					transactionCount: { $sum: 1 }
				}
			},
			{ $sort: { totalAmount: -1 } }
		]);

		const categories = result.map((item) => {
			const category = req.user.categories.id(item._id);
			return {
				categoryId: item._id,
				categoryName: category ? category.name : "Unknown",
				totalAmount: item.totalAmount,
				transactionCount: item.transactionCount
			};
		});

		return res.status(200).json({ categories });
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve category summary");
	}
};

const getMonthlySummary = async (req, res) => {
	try {
		const result = await Transaction.aggregate([
			{ $match: { userId: req.user._id } },
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m", date: "$date" } },
					income: {
						$sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
					},
					expense: {
						$sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
					}
				}
			},
			{ $sort: { _id: 1 } }
		]);

		return res.status(200).json({
			monthly: result.map((item) => ({
				month: item._id,
				income: item.income,
				expense: item.expense
			}))
		});
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve monthly summary");
	}
};

const createTransaction = async (req, res) => {
	const { type, categoryId, title, description, amount, date, paymentMethod, notes } = req.body || {};
	if (!categoryId) {
		return res.status(400).json({ error: "Category ID is required" });
	}
	if (!isValidObjectId(categoryId)) {
		return res.status(400).json({ error: "Invalid category ID" });
	}

	const validationError = validateTransactionFields(
		{ type, categoryId, title, amount, date, paymentMethod },
		req.user
	);

	if (validationError) {
		return res.status(validationError === "Category not found" ? 404 : 400).json({
			error: validationError
		});
	}

	try {
		const transaction = await Transaction.create({
			userId: req.user._id,
			type,
			categoryId,
			title: title.trim(),
			description: description === undefined ? "" : description,
			amount,
			date: parseDate(date),
			paymentMethod,
			notes: notes === undefined ? "" : notes
		});

		return res.status(201).json({ transaction });
	} catch (error) {
		return handleDatabaseError(res, error, "Create transaction");
	}
};

const getTransaction = async (req, res) => {
	const { transactionId } = req.params;
	if (!isValidObjectId(transactionId)) {
		return res.status(400).json({ error: "Invalid transaction ID" });
	}

	try {
		const transaction = await Transaction.findOne({
			_id: transactionId,
			userId: req.user._id
		});

		if (!transaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		return res.status(200).json({ transaction });
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve transaction");
	}
};

const updateTransaction = async (req, res) => {
	const { transactionId } = req.params;
	if (!isValidObjectId(transactionId)) {
		return res.status(400).json({ error: "Invalid transaction ID" });
	}

	try {
		const transaction = await Transaction.findOne({
			_id: transactionId,
			userId: req.user._id
		});

		if (!transaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		const allowedFields = [
			"type",
			"categoryId",
			"title",
			"description",
			"amount",
			"date",
			"paymentMethod",
			"notes"
		];
		const updates = {};
		for (const field of allowedFields) {
			if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
				updates[field] = req.body[field];
			}
		}

		if (!Object.keys(updates).length) {
			return res.status(400).json({ error: "At least one transaction field is required" });
		}

		if (updates.categoryId !== undefined && !isValidObjectId(updates.categoryId)) {
			return res.status(400).json({ error: "Invalid category ID" });
		}

		const validationError = validateTransactionFields({
			type: updates.type === undefined ? transaction.type : updates.type,
			categoryId: updates.categoryId === undefined ? transaction.categoryId : updates.categoryId,
			title: updates.title === undefined ? transaction.title : updates.title,
			amount: updates.amount === undefined ? transaction.amount : updates.amount,
			date: updates.date === undefined ? transaction.date : updates.date,
			paymentMethod: updates.paymentMethod === undefined ? transaction.paymentMethod : updates.paymentMethod
		}, req.user);

		if (validationError) {
			return res.status(validationError === "Category not found" ? 404 : 400).json({
				error: validationError
			});
		}

		if (updates.title !== undefined) {
			if (typeof updates.title !== "string" || !updates.title.trim()) {
				return res.status(400).json({ error: "Transaction title is required" });
			}
			updates.title = updates.title.trim();
		}
		if (updates.date !== undefined) updates.date = parseDate(updates.date);

		Object.assign(transaction, updates);
		await transaction.save();

		return res.status(200).json({ transaction });
	} catch (error) {
		return handleDatabaseError(res, error, "Update transaction");
	}
};

const deleteTransaction = async (req, res) => {
	const { transactionId } = req.params;
	if (!isValidObjectId(transactionId)) {
		return res.status(400).json({ error: "Invalid transaction ID" });
	}

	try {
		const transaction = await Transaction.findOneAndDelete({
			_id: transactionId,
			userId: req.user._id
		});

		if (!transaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		return res.status(200).json({ message: "Transaction deleted successfully" });
	} catch (error) {
		return handleDatabaseError(res, error, "Delete transaction");
	}
};

module.exports = {
	getTransactions,
	getSummary,
	getCategorySummary,
	getMonthlySummary,
	createTransaction,
	getTransaction,
	updateTransaction,
	deleteTransaction
};
