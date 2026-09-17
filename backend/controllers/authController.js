const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const PendingRegistration = require("../models/pendingRegistration");
const {
	sendSettingsPasswordRecoveryEmail,
	sendVerificationEmail,
	sendPasswordResetEmail
} = require("../services/emailService");

const defaultCategories = [
	{ name: "Salary", icon: "💼" },
	{ name: "College", icon: "🎓" },
	{ name: "Food", icon: "🍔" },
	{ name: "Outings", icon: "🎉" },
	{ name: "Education", icon: "📚" },
	{ name: "Others", icon: "📦" }
];

const verificationCodeExpiresMinutes = Number(
	process.env.EMAIL_VERIFICATION_EXPIRES_MINUTES || 10
);
const resendCooldownSeconds = Number(process.env.EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS || 60);
const settingsResetAuthorizationMinutes = Number(process.env.SETTINGS_PASSWORD_RESET_AUTHORIZATION_MINUTES || 10);

const normalizeEmail = (email) => (
	typeof email === "string" ? email.trim().toLowerCase() : email
);

const hashVerificationCode = (verificationCode) => crypto
	.createHash("sha256")
	.update(verificationCode)
	.digest("hex");

const logEmailFailure = (context, error) => {
	console.error(`[EMAIL] ${context} failed`, {
		name: error.name,
		message: error.providerMessage || error.message,
		code: error.code,
		providerName: error.providerName,
		statusCode: error.providerStatusCode
	});
};

const safeUser = (user) => ({
	id: user._id,
	_id: user._id,
	name: user.name,
	email: user.email,
	currency: user.currency,
	isEmailVerified: user.isEmailVerified,
	createdAt: user.createdAt
});

const createSettingsPasswordResetCode = () => crypto.randomInt(100000, 1000000).toString();

const sendSettingsPasswordResetCode = async (user) => {
	const verificationCode = createSettingsPasswordResetCode();
	user.settingsPasswordResetCodeHash = hashVerificationCode(verificationCode);
	user.settingsPasswordResetExpires = new Date(
		Date.now() + verificationCodeExpiresMinutes * 60 * 1000
	);
	user.settingsPasswordResetAuthorizedUntil = null;
	user.settingsPasswordResetLastCodeSentAt = new Date();
	await user.save();

	try {
		await sendSettingsPasswordRecoveryEmail(user.email, user.name, verificationCode);
	} catch (error) {
		user.settingsPasswordResetCodeHash = null;
		user.settingsPasswordResetExpires = null;
		user.settingsPasswordResetLastCodeSentAt = null;
		await user.save();
		throw error;
	}
};


const register = async (req, res) => {
	const name = typeof req.body?.name === "string" ? req.body.name.trim() : req.body?.name;
	const email = normalizeEmail(req.body?.email);
	console.log("[AUTH] Registration request received");

	try {
		if (typeof name !== "string" || !name) {
			return res.status(400).json({
				error: "Name is required"
			});
		}

		if (typeof email !== "string" || !email) {
			return res.status(400).json({
				error: "Email is required"
			});
		}
		console.log("[AUTH] Registration email normalized");

		const existingUser = await User.findOne({ email }).select("_id").lean();
		console.log("[AUTH] Existing user check completed");
		if (existingUser) {
			return res.status(409).json({
				error: "Email already exists"
			});
		}

		const verificationCode = crypto.randomInt(100000, 1000000).toString();
		const verificationExpires = new Date(
			Date.now() + verificationCodeExpiresMinutes * 60 * 1000
		);
		const codeSentAt = new Date();

		const pendingRegistration = await PendingRegistration.findOneAndUpdate(
			{ email },
			{
				name,
				verificationCodeHash: hashVerificationCode(verificationCode),
				expiresAt: verificationExpires,
				lastCodeSentAt: codeSentAt
			},
			{ upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
		);

		try {
			console.log("[AUTH] Verification email send started");
			await sendVerificationEmail(email, name, verificationCode);
			console.log("[AUTH] Verification email send completed");
		} catch (emailError) {
			await PendingRegistration.deleteOne({
				_id: pendingRegistration._id,
				verificationCodeHash: pendingRegistration.verificationCodeHash
			});
			throw emailError;
		}

		return res.status(201).json({
			message: "A verification code has been sent to your email"
		});
	} catch (error) {
		console.error("[AUTH] Registration failed", {
			name: error.name,
			message: error.providerMessage || error.message,
			code: error.code,
			providerName: error.providerName,
			statusCode: error.providerStatusCode
		});
		if (error.code === 11000) {
			return res.status(409).json({
				error: "Email already exists"
			});
		}

		if (error.name === "ValidationError") {
			return res.status(400).json({
				error: "Invalid registration data",
				details: Object.values(error.errors).map((validationError) => validationError.message)
			});
		}

		if (error.code === "EMAIL_NOT_CONFIGURED") {
			return res.status(503).json({
				error: "Email service is not configured"
			});
		}

		if (error.code === "EMAIL_PROVIDER_ERROR") {
			logEmailFailure("Registration email", error);
			return res.status(502).json({
				error: "Email provider rejected the message"
			});
		}

		console.error("Registration failed:", error.message);
		return res.status(500).json({
			error: "Unable to register user"
		});
	}
};

const verifyEmail = async (req, res) => {
	const email = normalizeEmail(req.body?.email);
	const verificationCode = typeof req.body?.verificationCode === "string"
		? req.body.verificationCode.trim()
		: req.body?.verificationCode;

	if (typeof email !== "string" || !email) {
		return res.status(400).json({
			error: "Email is required"
		});
	}

	if (typeof verificationCode !== "string" || !/^\d{6}$/.test(verificationCode)) {
		return res.status(400).json({
			error: "A valid 6-digit verification code is required"
		});
	}

	try {
		const existingUser = await User.findOne({ email }).select("_id").lean();
		if (existingUser) {
			return res.status(409).json({
				error: "Email already exists"
			});
		}

		const pendingRegistration = await PendingRegistration.findOne({
			email,
			verificationCodeHash: hashVerificationCode(verificationCode),
			expiresAt: { $gt: new Date() }
		});

		if (!pendingRegistration) {
			const pendingEmail = await PendingRegistration.findOne({ email }).select("expiresAt").lean();
			return res.status(400).json({
				error: pendingEmail && pendingEmail.expiresAt <= new Date()
					? "Verification code has expired"
					: "Invalid verification code"
			});
		}

		try {
			await User.create({
				name: pendingRegistration.name,
				email: pendingRegistration.email,
				isEmailVerified: true,
				categories: defaultCategories
			});
		} catch (error) {
			if (error.code === 11000) {
				return res.status(409).json({
					error: "Email already exists"
				});
			}
			throw error;
		}

		await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

		return res.status(200).json({
			message: "Email verified successfully. You can now set your password."
		});
	} catch (error) {
		console.error("Email verification failed:", error.message);
		return res.status(500).json({
			error: "Unable to verify email"
		});
	}
};

const resendCode = async (req, res) => {
	const email = normalizeEmail(req.body?.email);

	if (typeof email !== "string" || !email) {
		return res.status(400).json({ error: "Email is required" });
	}

	try {
		const existingUser = await User.findOne({ email }).select("_id").lean();
		if (existingUser) {
			return res.status(409).json({ error: "Email already exists" });
		}

		const pendingRegistration = await PendingRegistration.findOne({ email });
		if (!pendingRegistration) {
			return res.status(404).json({
				error: "No pending registration found. Please register again."
			});
		}

		const now = new Date();
		const lastCodeSentAt = pendingRegistration.lastCodeSentAt || pendingRegistration.createdAt || new Date(0);
		const cooldownEndsAt = new Date(
			lastCodeSentAt.getTime() + resendCooldownSeconds * 1000
		);
		if (cooldownEndsAt > now) {
			const waitSeconds = Math.ceil((cooldownEndsAt.getTime() - now.getTime()) / 1000);
			return res.status(429).json({
				error: `Please wait ${waitSeconds} seconds before requesting another code`
			});
		}

		const verificationCode = crypto.randomInt(100000, 1000000).toString();
		pendingRegistration.verificationCodeHash = hashVerificationCode(verificationCode);
		pendingRegistration.expiresAt = new Date(
			Date.now() + verificationCodeExpiresMinutes * 60 * 1000
		);
		pendingRegistration.lastCodeSentAt = now;
		await pendingRegistration.save();

		try {
			console.log("[AUTH] Verification email resend started");
			await sendVerificationEmail(email, pendingRegistration.name, verificationCode);
			console.log("[AUTH] Verification email resend completed");
		} catch (emailError) {
			await PendingRegistration.deleteOne({
				_id: pendingRegistration._id,
				verificationCodeHash: pendingRegistration.verificationCodeHash
			});
			throw emailError;
		}

		return res.status(200).json({
			message: "New verification code sent"
		});
	} catch (error) {
		if (error.code === "EMAIL_NOT_CONFIGURED") {
			return res.status(503).json({ error: "Email service is not configured" });
		}

		if (error.code === "EMAIL_PROVIDER_ERROR") {
			logEmailFailure("Verification resend", error);
			return res.status(502).json({ error: "Email provider rejected the message" });
		}

		console.error("Resend verification code failed:", error.message);
		return res.status(500).json({ error: "Unable to resend verification code" });
	}
};

const setPassword = async (req, res) => {
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : req.body?.email;
	const password = req.body?.password;

	if (typeof email !== "string" || !email) {
		return res.status(400).json({
			error: "Email is required"
		});
	}

	if (typeof password !== "string" || !password.trim() || password.length < 8) {
		return res.status(400).json({
			error: "Password must be at least 8 characters long"
		});
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				error: "User not found"
			});
		}

		if (!user.isEmailVerified) {
			return res.status(403).json({
				error: "Email must be verified before setting a password"
			});
		}

		user.password = await bcrypt.hash(password, 12);
		await user.save();

		return res.status(200).json({
			message: "Password set successfully. You can now log in."
		});
	} catch (error) {
		console.error("Setting password failed:", error.message);
		return res.status(500).json({
			error: "Unable to set password"
		});
	}
};

const login = async (req, res) => {
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : req.body?.email;
	const password = req.body?.password;

	if (typeof email !== "string" || !email || typeof password !== "string" || !password) {
		return res.status(400).json({
			error: "Email and password are required"
		});
	}

	if (!process.env.JWT_SECRET) {
		console.error("Login failed: JWT_SECRET is not configured");
		return res.status(503).json({
			error: "Authentication service is not configured"
		});
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({
				error: "Invalid email or password"
			});
		}

		if (!user.isEmailVerified) {
			return res.status(403).json({
				error: "Email must be verified before logging in"
			});
		}

		if (!user.password) {
			return res.status(401).json({
				error: "Invalid email or password"
			});
		}

		const passwordMatches = await bcrypt.compare(password, user.password);
		if (!passwordMatches) {
			return res.status(401).json({
				error: "Invalid email or password"
			});
		}

		const token = jwt.sign(
			{ id: user._id.toString() },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
		);

		return res.status(200).json({
			token,
			user: safeUser(user)
		});
	} catch (error) {
		console.error("Login failed:", error.message);
		return res.status(500).json({
			error: "Unable to log in"
		});
	}
};

const forgotPassword = async (req, res) => {
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : req.body?.email;
	const genericResponse = {
		message: "If an account exists for this email, a password reset code has been sent."
	};

	if (typeof email !== "string" || !email) {
		return res.status(400).json({
			error: "Email is required"
		});
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(200).json(genericResponse);
		}

		const resetCode = crypto.randomInt(100000, 1000000).toString();
		user.passwordResetCode = resetCode;
		user.passwordResetExpires = new Date(
			Date.now() + verificationCodeExpiresMinutes * 60 * 1000
		);
		await user.save();

		try {
			await sendPasswordResetEmail(user.email, user.name, resetCode);
		} catch (emailError) {
			user.passwordResetCode = null;
			user.passwordResetExpires = null;
			await user.save();
			throw emailError;
		}

		return res.status(200).json(genericResponse);
	} catch (error) {
		if (error.code === "EMAIL_NOT_CONFIGURED") {
			return res.status(503).json({
				error: "Email service is not configured"
			});
		}

		if (error.code === "EMAIL_PROVIDER_ERROR") {
			logEmailFailure("Password reset email", error);
			return res.status(502).json({
				error: "Email provider rejected the message"
			});
		}

		console.error("Forgot password request failed:", error.message);
		return res.status(500).json({
			error: "Unable to process password reset request"
		});
	}
};

const resetPassword = async (req, res) => {
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : req.body?.email;
	const code = typeof req.body?.code === "string" ? req.body.code.trim() : req.body?.code;
	const newPassword = req.body?.newPassword;

	if (typeof email !== "string" || !email) {
		return res.status(400).json({
			error: "Email is required"
		});
	}

	if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
		return res.status(400).json({
			error: "A valid 6-digit reset code is required"
		});
	}

	if (typeof newPassword !== "string" || !newPassword.trim() || newPassword.length < 8) {
		return res.status(400).json({
			error: "New password must be at least 8 characters long"
		});
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				error: "Invalid or expired reset code"
			});
		}

		if (!user.passwordResetCode || user.passwordResetCode !== code) {
			return res.status(400).json({
				error: "Invalid or expired reset code"
			});
		}

		if (!user.passwordResetExpires || user.passwordResetExpires <= new Date()) {
			return res.status(400).json({
				error: "Invalid or expired reset code"
			});
		}

		user.password = await bcrypt.hash(newPassword, 12);
		user.passwordResetCode = null;
		user.passwordResetExpires = null;
		await user.save();

		return res.status(200).json({
			message: "Password reset successfully. You can now log in."
		});
	} catch (error) {
		console.error("Password reset failed:", error.message);
		return res.status(500).json({
			error: "Unable to reset password"
		});
	}
};

const sendSettingsPasswordRecoveryCode = async (req, res) => {
	try {
		const lastSentAt = req.user.settingsPasswordResetLastCodeSentAt;
		if (lastSentAt) {
			const cooldownEndsAt = new Date(lastSentAt.getTime() + resendCooldownSeconds * 1000);
			if (cooldownEndsAt > new Date()) {
				return res.status(429).json({
					error: "Please wait before requesting another code"
				});
			}
		}

		await sendSettingsPasswordResetCode(req.user);
		return res.status(200).json({
			message: "Verification code sent"
		});
	} catch (error) {
		if (error.code === "EMAIL_NOT_CONFIGURED") {
			return res.status(503).json({ error: "Email service is not configured" });
		}

		if (error.code === "EMAIL_PROVIDER_ERROR") {
			logEmailFailure("Settings recovery email", error);
			return res.status(502).json({ error: "Email provider rejected the message" });
		}

		console.error("Settings password recovery code failed:", error.message);
		return res.status(500).json({ error: "Unable to send verification code" });
	}
};

const verifySettingsPasswordRecoveryCode = async (req, res) => {
	const code = typeof req.body?.code === "string" ? req.body.code.trim() : req.body?.code;

	if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
		return res.status(400).json({ error: "A valid 6-digit verification code is required" });
	}

	try {
		const authorizedUntil = new Date(
			Date.now() + settingsResetAuthorizationMinutes * 60 * 1000
		);
		const user = await User.findOneAndUpdate(
			{
				_id: req.user._id,
				settingsPasswordResetCodeHash: hashVerificationCode(code),
				settingsPasswordResetExpires: { $gt: new Date() }
			},
			{
				$set: { settingsPasswordResetAuthorizedUntil: authorizedUntil },
				$unset: {
					settingsPasswordResetCodeHash: "",
					settingsPasswordResetExpires: ""
				}
			},
			{ returnDocument: "after" }
		);

		if (!user) {
			const hasUnexpiredCode = req.user.settingsPasswordResetExpires
				&& req.user.settingsPasswordResetExpires > new Date();
			return res.status(400).json({
				error: hasUnexpiredCode ? "Invalid verification code" : "Verification code expired"
			});
		}

		return res.status(200).json({
			message: "Email verified. You can now set a new password."
		});
	} catch (error) {
		console.error("Settings password recovery verification failed:", error.message);
		return res.status(500).json({ error: "Unable to verify recovery code" });
	}
};

const resetPasswordFromSettings = async (req, res) => {
	const newPassword = req.body?.newPassword;

	if (typeof newPassword !== "string" || !newPassword.trim() || newPassword.length < 8) {
		return res.status(400).json({
			error: "New password must be at least 8 characters long"
		});
	}

	try {
		const password = await bcrypt.hash(newPassword, 12);
		const user = await User.findOneAndUpdate(
			{
				_id: req.user._id,
				settingsPasswordResetAuthorizedUntil: { $gt: new Date() }
			},
			{
				$set: { password },
				$unset: {
					settingsPasswordResetAuthorizedUntil: "",
					settingsPasswordResetCodeHash: "",
					settingsPasswordResetExpires: "",
					settingsPasswordResetLastCodeSentAt: ""
				}
			},
			{ returnDocument: "after" }
		);

		if (!user) {
			return res.status(403).json({ error: "Password reset authorization expired" });
		}

		return res.status(200).json({ message: "Password reset successful" });
	} catch (error) {
		console.error("Settings password reset failed:", error.message);
		return res.status(500).json({ error: "Unable to reset password" });
	}
};

const getCurrentUser = async (req, res) => {
	return res.status(200).json({ user: safeUser(req.user) });
};

const updateProfile = async (req, res) => {
	const name = typeof req.body?.name === "string" ? req.body.name.trim() : req.body?.name;

	if (typeof name !== "string" || !name) {
		return res.status(400).json({ error: "Name is required" });
	}

	if (name.length < 2 || name.length > 50) {
		return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
	}

	try {
		req.user.name = name;
		await req.user.save();
		return res.status(200).json({ user: safeUser(req.user) });
	} catch (error) {
		if (error.name === "ValidationError") {
			return res.status(400).json({ error: "Invalid profile data" });
		}

		console.error("Profile update failed:", error.message);
		return res.status(500).json({ error: "Unable to update profile" });
	}
};

const updateCurrency = async (req, res) => {
	const allowedCurrencies = ["INR", "USD", "EUR", "GBP"];
	const currency = typeof req.body?.currency === "string" ? req.body.currency.trim().toUpperCase() : req.body?.currency;

	if (!allowedCurrencies.includes(currency)) {
		return res.status(400).json({ error: "Currency must be INR, USD, EUR, or GBP" });
	}

	try {
		req.user.currency = currency;
		await req.user.save();
		return res.status(200).json({ user: safeUser(req.user) });
	} catch (error) {
		console.error("Currency update failed:", error.message);
		return res.status(500).json({ error: "Unable to update currency" });
	}
};

const changePassword = async (req, res) => {
	const currentPassword = req.body?.currentPassword;
	const newPassword = req.body?.newPassword;

	if (typeof currentPassword !== "string" || !currentPassword || typeof newPassword !== "string" || !newPassword) {
		return res.status(400).json({ error: "Current password and new password are required" });
	}

	if (!newPassword.trim() || newPassword.length < 8) {
		return res.status(400).json({ error: "New password must be at least 8 characters long" });
	}

	try {
		if (!req.user.password || !(await bcrypt.compare(currentPassword, req.user.password))) {
			return res.status(401).json({ error: "Current password is incorrect" });
		}

		req.user.password = await bcrypt.hash(newPassword, 12);
		await req.user.save();
		return res.status(200).json({ message: "Password changed successfully." });
	} catch (error) {
		console.error("Password change failed:", error.message);
		return res.status(500).json({ error: "Unable to change password" });
	}
};

module.exports = {
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
	changePassword,
};
