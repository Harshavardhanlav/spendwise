const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
	register,
	verifyEmail,
	resendCode,
	setPassword,
	login,
	forgotPassword,
	resetPassword,
	sendSettingsPasswordRecoveryCode,
	verifySettingsPasswordRecoveryCode,
	resetPasswordFromSettings,
	getCurrentUser,
	updateProfile,
	updateCurrency,
	changePassword
} = require("../controllers/authController");

const router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);
router.post("/set-password", setPassword);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/settings/forgot-password", authenticate, sendSettingsPasswordRecoveryCode);
router.post("/settings/verify-password-reset-code", authenticate, verifySettingsPasswordRecoveryCode);
router.post("/settings/reset-password", authenticate, resetPasswordFromSettings);
router.get("/me", authenticate, getCurrentUser);
router.put("/profile", authenticate, updateProfile);
router.put("/currency", authenticate, updateCurrency);
router.put("/change-password", authenticate, changePassword);

module.exports = router;