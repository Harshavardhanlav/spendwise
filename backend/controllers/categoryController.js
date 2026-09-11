const mongoose = require("mongoose");

const isValidCategoryId = (categoryId) => mongoose.Types.ObjectId.isValid(categoryId);

const normalizeCategoryName = (name) => name.trim().toLowerCase();

const hasDuplicateCategory = (categories, name, excludedId) => categories.some((category) => (
	category._id.toString() !== excludedId
	&& normalizeCategoryName(category.name) === normalizeCategoryName(name)
));

const getCategories = async (req, res) => {
	try {
		return res.status(200).json({
			categories: req.user.categories
		});
	} catch (error) {
		console.error("Category retrieval failed:", error.message);
		return res.status(500).json({ error: "Unable to retrieve categories" });
	}
};

const createCategory = async (req, res) => {
	const name = typeof req.body?.name === "string" ? req.body.name.trim() : req.body?.name;
	const icon = req.body?.icon === undefined ? "" : req.body.icon;

	if (typeof name !== "string" || !name) {
		return res.status(400).json({ error: "Category name is required" });
	}

	if (typeof icon !== "string") {
		return res.status(400).json({ error: "Category icon must be a string" });
	}

	if (hasDuplicateCategory(req.user.categories, name, "")) {
		return res.status(409).json({ error: "This category already exists" });
	}

	try {
		const category = req.user.categories.create({ name, icon });
		req.user.categories.push(category);
		await req.user.save();

		return res.status(201).json({ category });
	} catch (error) {
		if (error.name === "ValidationError") {
			return res.status(400).json({ error: "Invalid category data" });
		}

		console.error("Category creation failed:", error.message);
		return res.status(500).json({ error: "Unable to create category" });
	}
};

const updateCategory = async (req, res) => {
	const { categoryId } = req.params;
	if (!isValidCategoryId(categoryId)) {
		return res.status(400).json({ error: "Invalid category ID" });
	}

	const category = req.user.categories.id(categoryId);
	if (!category) {
		return res.status(404).json({ error: "Category not found" });
	}

	const updates = {};
	if (Object.prototype.hasOwnProperty.call(req.body || {}, "name")) {
		if (typeof req.body.name !== "string" || !req.body.name.trim()) {
			return res.status(400).json({ error: "Category name must not be empty" });
		}
		updates.name = req.body.name.trim();
	}
	if (Object.prototype.hasOwnProperty.call(req.body || {}, "icon")) {
		if (typeof req.body.icon !== "string") {
			return res.status(400).json({ error: "Category icon must be a string" });
		}
		updates.icon = req.body.icon;
	}

	if (!Object.keys(updates).length) {
		return res.status(400).json({ error: "At least one category field is required" });
	}

	const nextName = updates.name || category.name;
	if (hasDuplicateCategory(req.user.categories, nextName, categoryId)) {
		return res.status(409).json({ error: "This category already exists" });
	}

	try {
		Object.assign(category, updates);
		await req.user.save();

		return res.status(200).json({ category });
	} catch (error) {
		if (error.name === "ValidationError") {
			return res.status(400).json({ error: "Invalid category data" });
		}

		console.error("Category update failed:", error.message);
		return res.status(500).json({ error: "Unable to update category" });
	}
};

const deleteCategory = async (req, res) => {
	const { categoryId } = req.params;
	if (!isValidCategoryId(categoryId)) {
		return res.status(400).json({ error: "Invalid category ID" });
	}

	const category = req.user.categories.id(categoryId);
	if (!category) {
		return res.status(404).json({ error: "Category not found" });
	}

	try {
		category.deleteOne();
		await req.user.save();

		return res.status(200).json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error("Category deletion failed:", error.message);
		return res.status(500).json({ error: "Unable to delete category" });
	}
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
