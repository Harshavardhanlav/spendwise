const express = require("express");
const {
	register,
	verifyEmail,
	setPassword,
	login,
	forgotPassword,
	resetPassword
} = require("../controllers/authController");

const router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/set-password", setPassword);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;