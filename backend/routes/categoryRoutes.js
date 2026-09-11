const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const router = express.Router();
router.use(authenticate);

// Get all categories of current user
router.get("/", getCategories);

// Add new category
router.post("/", createCategory);

// Update category
router.put("/:categoryId", updateCategory);

// Delete category
router.delete("/:categoryId", deleteCategory);

module.exports = router;