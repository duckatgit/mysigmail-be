const express = require("express");
const router = express.Router();
const { verifyEmail, signup, resendVerifyEmail, signin, forgotPassword, setNewPassword, validateToken } = require("../controllers/authController");

router.post("/sign-up", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-verify-email", resendVerifyEmail);
router.post("/sign-in", signin);
router.post("/forgot-password", forgotPassword);
router.put("/set-new-password", setNewPassword);
router.post("/validate-token", validateToken);

module.exports = router;
