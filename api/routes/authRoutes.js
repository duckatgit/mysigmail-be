const express = require("express");
const router = express.Router();
const { verifyEmail, signup, resendVerifyEmail } = require("../controllers/authController");

router.post("/sign-up", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-verify-email", resendVerifyEmail);

module.exports = router;
