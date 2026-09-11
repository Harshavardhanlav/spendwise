const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
	register,
	verifyEmail,
	setPassword,
	login,
	forgotPassword,
	resetPassword,
	getCurrentUser,
	updateProfile,
	updateCurrency,
	changePassword
} = require("../controllers/authController");

const router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/set-password", setPassword);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getCurrentUser);
router.put("/profile", authenticate, updateProfile);
router.put("/currency", authenticate, updateCurrency);
router.put("/change-password", authenticate, changePassword);

module.exports = router;