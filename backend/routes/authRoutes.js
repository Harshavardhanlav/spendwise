const express = require("express");
const { register, verifyEmail, setPassword, login } = require("../controllers/authController");

const router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/set-password", setPassword);
router.post("/login", login);

module.exports = router;