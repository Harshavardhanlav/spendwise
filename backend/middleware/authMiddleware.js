const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
	const authorization = req.get("Authorization");

	if (!authorization) {
		return res.status(401).json({
			error: "Authentication required"
		});
	}

	const [scheme, token, extra] = authorization.trim().split(/\s+/);
	if (scheme !== "Bearer" || !token || extra) {
		return res.status(401).json({
			error: "Authorization header must use Bearer token format"
		});
	}

	if (!process.env.JWT_SECRET) {
		return res.status(503).json({
			error: "Authentication service is not configured"
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const userId = decoded.id;

		if (!userId) {
			return res.status(401).json({
				error: "Invalid authentication token"
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(401).json({
				error: "Authenticated user not found"
			});
		}

		req.user = user;
		return next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				error: "Authentication token has expired"
			});
		}

		if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
			return res.status(401).json({
				error: "Invalid authentication token"
			});
		}

		if (error.name === "CastError") {
			return res.status(401).json({
				error: "Authenticated user not found"
			});
		}

		console.error("Authentication failed:", error.message);
		return res.status(500).json({
			error: "Unable to authenticate request"
		});
	}
};

module.exports = authenticate;
