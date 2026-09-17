const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 50
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},

		verificationCodeHash: {
			type: String,
			required: true
		},

		expiresAt: {
			type: Date,
			required: true
		}
	},
	{
		timestamps: true
	}
);

pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);