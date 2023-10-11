const express = require("express");
const router = express.Router();
const signup = require("../controllers/authController");


router.post("/sign-up", signup);

module.exports = router;
