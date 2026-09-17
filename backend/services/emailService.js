const verificationCodeExpiresMinutes = Number(
	process.env.EMAIL_VERIFICATION_EXPIRES_MINUTES || 10
);

const sendlibUrl = "https://sendlib.samueltuoyo.com/api/send";

const ensureEmailConfiguration = () => {
	if (!process.env.SENDLIB_API_KEY || !process.env.EMAIL_FROM) {
		const error = new Error("Email service is not configured");
		error.code = "EMAIL_NOT_CONFIGURED";
		throw error;
	}
};


const sendEmail = async ({ to, subject, html }) => {
	ensureEmailConfiguration();

	const response = await fetch(sendlibUrl, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.SENDLIB_API_KEY}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			from: process.env.EMAIL_FROM,
			to,
			subject,
			html
		})
	});

	let responseBody = null;
	try {
		responseBody = await response.json();
	} catch (error) {
		responseBody = null;
	}

	if (!response.ok || responseBody?.error) {
		const emailError = new Error("Email provider rejected the message");
		emailError.code = "EMAIL_PROVIDER_ERROR";
		emailError.providerMessage = responseBody?.error?.message || responseBody?.message || `Sendlib returned HTTP ${response.status}`;
		emailError.providerName = responseBody?.error?.name || responseBody?.error?.code;
		emailError.providerStatusCode = response.status;
		throw emailError;
	}

	return responseBody;
};

const sendVerificationEmail = (email, name, verificationCode) => sendEmail({
	to: email,
	subject: "SpendWise email verification",
	html: `<p>Hi ${name},</p><p>Your SpendWise verification code is <strong>${verificationCode}</strong>.</p><p>It expires in ${verificationCodeExpiresMinutes} minutes.</p>`
});

const sendPasswordResetEmail = (email, name, resetCode) => sendEmail({
	to: email,
	subject: "Reset your SpendWise password",
	html: `<p>Hi ${name},</p><p>Your SpendWise password reset code is <strong>${resetCode}</strong>.</p><p>It expires in ${verificationCodeExpiresMinutes} minutes. Use this code to create a new password.</p>`
});

const sendSettingsPasswordRecoveryEmail = (email, name, verificationCode) => sendEmail({
	to: email,
	subject: "Verify your SpendWise password recovery request",
	html: `<p>Hi ${name},</p><p>Your SpendWise password recovery code is <strong>${verificationCode}</strong>.</p><p>It expires in ${verificationCodeExpiresMinutes} minutes.</p>`
});

module.exports = {
	sendPasswordResetEmail,
	sendSettingsPasswordRecoveryEmail,
	sendVerificationEmail
};
