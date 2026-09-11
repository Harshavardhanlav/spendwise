const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");

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

const createMailTransporter = () => {
	const requiredSettings = [
		"SMTP_HOST",
		"SMTP_PORT",
		"SMTP_USER",
		"SMTP_PASS",
		"EMAIL_FROM"
	];

	if (requiredSettings.some((setting) => !process.env[setting])) {
		const error = new Error("Email service is not configured");
		error.code = "EMAIL_NOT_CONFIGURED";
		throw error;
	}

	return nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: process.env.SMTP_SECURE === "true",
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS.replace(/\s+/g, "")
		}
	});
};

const isSmtpAuthenticationError = (error) => (
	error?.code === "EAUTH" || error?.responseCode === 535
);

const safeUser = (user) => ({
	id: user._id,
	_id: user._id,
	name: user.name,
	email: user.email,
	currency: user.currency,
	isEmailVerified: user.isEmailVerified,
	createdAt: user.createdAt
});

const sendVerificationEmail = async (email, name, verificationCode) => {
	const transporter = createMailTransporter();

	await transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to: email,
		subject: "Verify your SpendWise email",
		text: `Hi ${name}, your SpendWise verification code is ${verificationCode}. It expires in ${verificationCodeExpiresMinutes} minutes.`
	});
};

const sendPasswordResetEmail = async (email, name, resetCode) => {
	const transporter = createMailTransporter();

	await transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to: email,
		subject: "Reset your SpendWise password",
		text: `Hi ${name}, your SpendWise password reset code is ${resetCode}. It expires in ${verificationCodeExpiresMinutes} minutes. Use this code to create a new password.`
	});
};

const verifyEmailTransport = async () => {
	try {
		const transporter = createMailTransporter();
		await transporter.verify();
		console.log("SMTP configuration verified successfully");
	} catch (error) {
		if (isSmtpAuthenticationError(error)) {
			console.error("SMTP authentication failed: check SMTP_USER and the Gmail App Password in backend/.env");
			return;
		}

		if (error?.code === "EMAIL_NOT_CONFIGURED") {
			console.error("SMTP configuration check failed: required SMTP environment variables are missing");
			return;
		}

		console.error("SMTP connection check failed:", error.message);
	}
};

const register = async (req, res) => {
	const name = typeof req.body?.name === "string" ? req.body.name.trim() : req.body?.name;
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : req.body?.email;

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

		const existingUser = await User.findOne({ email }).select("_id").lean();
		if (existingUser) {
			return res.status(409).json({
				error: "An account with this email already exists"
			});
		}

		const verificationCode = crypto.randomInt(100000, 1000000).toString();
		const verificationExpires = new Date(
			Date.now() + verificationCodeExpiresMinutes * 60 * 1000
		);

		const user = await User.create({
			name,
			email,
			emailVerificationCode: verificationCode,
			emailVerificationExpires: verificationExpires,
			categories: defaultCategories
		});

		try {
			await sendVerificationEmail(email, name, verificationCode);
		} catch (emailError) {
			await User.deleteOne({ _id: user._id });
			throw emailError;
		}

		return res.status(201).json({
			message: "A verification code has been sent to your email"
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({
				error: "An account with this email already exists"
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

		if (isSmtpAuthenticationError(error)) {
			console.error("Registration email failed: SMTP authentication failed");
			return res.status(502).json({
				error: "Email service authentication failed"
			});
		}

		console.error("Registration failed:", error.message);
		return res.status(500).json({
			error: "Unable to register user"
		});
	}
};

const verifyEmail = async (req, res) => {
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : req.body?.email;
	const verificationCode = typeof req.body?.verificationCode === "string"
		? req.body.verificationCode.trim()
		: req.body?.verificationCode;

	if (typeof email !== "string" || !email) {
		return res.status(400).json({
			error: "Email is required"
		});
	}

	if (typeof verificationCode !== "string" || !verificationCode) {
		return res.status(400).json({
			error: "Verification code is required"
		});
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				error: "User not found"
			});
		}

		if (user.isEmailVerified) {
			return res.status(409).json({
				error: "Email is already verified"
			});
		}

		if (user.emailVerificationCode !== verificationCode) {
			return res.status(400).json({
				error: "Invalid verification code"
			});
		}

		if (!user.emailVerificationExpires || user.emailVerificationExpires <= new Date()) {
			return res.status(400).json({
				error: "Verification code has expired"
			});
		}

		user.isEmailVerified = true;
		user.emailVerificationCode = null;
		user.emailVerificationExpires = null;
		await user.save();

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

		if (isSmtpAuthenticationError(error)) {
			console.error("Password reset email failed: SMTP authentication failed");
			return res.status(502).json({
				error: "Email service authentication failed"
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
	setPassword,
	login,
	forgotPassword,
	resetPassword,
	getCurrentUser,
	updateProfile,
	updateCurrency,
	changePassword,
	verifyEmailTransport
};
