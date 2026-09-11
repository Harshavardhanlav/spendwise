const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
  getBudgets,
  createBudget,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();
router.use(authenticate);

router.get("/", getBudgets);
router.post("/", createBudget);
router.get("/:budgetId", getBudgetById);
router.put("/:budgetId", updateBudget);
router.delete("/:budgetId", deleteBudget);

module.exports = router;
