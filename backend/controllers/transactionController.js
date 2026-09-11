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

const buildReportDateMatch = (userId, startDate, endDate) => {
	const match = { userId };
	if (startDate === undefined && endDate === undefined) {
		return { match };
	}

	const dateMatch = {};
	if (startDate !== undefined) {
		const parsedStartDate = parseDate(startDate);
		if (!parsedStartDate) return { error: "Start date is invalid" };
		dateMatch.$gte = parsedStartDate;
	}
	if (endDate !== undefined) {
		const parsedEndDate = parseDate(endDate);
		if (!parsedEndDate) return { error: "End date is invalid" };
		if (typeof endDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
			const exclusiveEndDate = new Date(parsedEndDate);
			exclusiveEndDate.setUTCDate(exclusiveEndDate.getUTCDate() + 1);
			dateMatch.$lt = exclusiveEndDate;
		} else {
			dateMatch.$lte = parsedEndDate;
		}
	}

	if (dateMatch.$gte && dateMatch.$lt && dateMatch.$gte >= dateMatch.$lt) {
		return { error: "Start date must not be after end date" };
	}
	if (dateMatch.$gte && dateMatch.$lte && dateMatch.$gte > dateMatch.$lte) {
		return { error: "Start date must not be after end date" };
	}

	return { match: { ...match, date: dateMatch } };
};

const getReportDateMatch = (req) => buildReportDateMatch(
	req.user._id,
	req.query.startDate,
	req.query.endDate
);

const getTotalsForMatch = async (match) => {
	const result = await Transaction.aggregate([
		{ $match: match },
		{
			$group: {
				_id: null,
				totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
				totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
			}
		}
	]);

	const totals = result[0] || { totalIncome: 0, totalExpense: 0 };
	return {
		income: totals.totalIncome || 0,
		expense: totals.totalExpense || 0,
		balance: (totals.totalIncome || 0) - (totals.totalExpense || 0)
	};
};

const percentageChange = (current, previous) => (
	previous === 0 ? null : Number((((current - previous) / previous) * 100).toFixed(2))
);

const getComparisonDateMatches = (req) => {
	const { startDate, endDate } = req.query;
	if (startDate === undefined && endDate === undefined) {
		const now = new Date();
		const currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
		const currentEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
		const previousStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
		return { currentStart, currentEnd, previousStart, previousEnd: currentStart };
	}

	if (startDate === undefined || endDate === undefined) {
		return { error: "Both startDate and endDate are required for comparison" };
	}

	const parsedStart = parseDate(startDate);
	const parsedEnd = parseDate(endDate);
	if (!parsedStart) return { error: "Start date is invalid" };
	if (!parsedEnd) return { error: "End date is invalid" };

	const currentStart = parsedStart;
	const currentEnd = new Date(parsedEnd);
	if (typeof endDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
		currentEnd.setUTCDate(currentEnd.getUTCDate() + 1);
	} else {
		currentEnd.setTime(currentEnd.getTime() + 1);
	}

	if (currentStart >= currentEnd) return { error: "Start date must not be after end date" };
	const periodLength = currentEnd.getTime() - currentStart.getTime();
	return {
		currentStart,
		currentEnd,
		previousStart: new Date(currentStart.getTime() - periodLength),
		previousEnd: currentStart
	};
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
		const dateResult = getReportDateMatch(req);
		if (dateResult.error) return res.status(400).json({ error: dateResult.error });

		const result = await Transaction.aggregate([
			{ $match: dateResult.match },
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
		const dateResult = getReportDateMatch(req);
		if (dateResult.error) return res.status(400).json({ error: dateResult.error });

		const result = await Transaction.aggregate([
			{ $match: { ...dateResult.match, type: "expense" } },
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

		const incomeResult = await Transaction.aggregate([
			{ $match: { ...dateResult.match, type: "income" } },
			{
				$group: {
					_id: "$categoryId",
					totalAmount: { $sum: "$amount" },
					transactionCount: { $sum: 1 }
				}
			},
			{ $sort: { totalAmount: -1 } }
		]);

		const incomeCategories = incomeResult.map((item) => {
			const category = req.user.categories.id(item._id);
			return {
				categoryId: item._id,
				categoryName: category ? category.name : "Unknown",
				totalAmount: item.totalAmount,
				transactionCount: item.transactionCount
			};
		});

		return res.status(200).json({ categories, expenseCategories: categories, incomeCategories });
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve category summary");
	}
};

const getMonthlySummary = async (req, res) => {
	try {
		const dateResult = getReportDateMatch(req);
		if (dateResult.error) return res.status(400).json({ error: dateResult.error });

		const result = await Transaction.aggregate([
			{ $match: dateResult.match },
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
				expense: item.expense,
				balance: item.income - item.expense
			}))
		});
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve monthly summary");
	}
};

const getPaymentMethodSummary = async (req, res) => {
	try {
		const dateResult = getReportDateMatch(req);
		if (dateResult.error) return res.status(400).json({ error: dateResult.error });

		const paymentMethodsResult = await Transaction.aggregate([
			{ $match: { ...dateResult.match, type: "expense" } },
			{
				$group: {
					_id: "$paymentMethod",
					totalAmount: { $sum: "$amount" },
					transactionCount: { $sum: 1 }
				}
			},
			{ $sort: { totalAmount: -1 } }
		]);

		return res.status(200).json({
			paymentMethods: paymentMethodsResult.map((item) => ({
				paymentMethod: item._id,
				totalAmount: item.totalAmount,
				transactionCount: item.transactionCount
			}))
		});
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve payment method summary");
	}
};

const getComparison = async (req, res) => {
	try {
		const ranges = getComparisonDateMatches(req);
		if (ranges.error) return res.status(400).json({ error: ranges.error });

		const userId = req.user._id;
		const [current, previous] = await Promise.all([
			getTotalsForMatch({ userId, date: { $gte: ranges.currentStart, $lt: ranges.currentEnd } }),
			getTotalsForMatch({ userId, date: { $gte: ranges.previousStart, $lt: ranges.previousEnd } })
		]);

		return res.status(200).json({
			current,
			previous,
			changes: {
				income: {
					amount: current.income - previous.income,
					percentage: percentageChange(current.income, previous.income)
				},
				expense: {
					amount: current.expense - previous.expense,
					percentage: percentageChange(current.expense, previous.expense)
				},
				balance: {
					amount: current.balance - previous.balance,
					percentage: percentageChange(current.balance, previous.balance)
				}
			}
		});
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve transaction comparison");
	}
};

const getReportTransactions = async (req, res) => {
	try {
		const filterResult = buildTransactionQuery(req);
		if (filterResult.error) {
			return res.status(filterResult.status || 400).json({ error: filterResult.error });
		}

		const { paymentMethod } = req.query;
		if (paymentMethod !== undefined) {
			if (!paymentMethods.includes(paymentMethod)) {
				return res.status(400).json({ error: "Payment method is invalid" });
			}
			filterResult.query.paymentMethod = paymentMethod;
		}

		const transactions = await Transaction.find(filterResult.query).sort({ date: -1 });
		return res.status(200).json({ transactions });
	} catch (error) {
		return handleDatabaseError(res, error, "Retrieve transaction report");
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
	getPaymentMethodSummary,
	getComparison,
	getReportTransactions,
	createTransaction,
	getTransaction,
	updateTransaction,
	deleteTransaction
};
