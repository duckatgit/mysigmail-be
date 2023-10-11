const express = require("express");
const router = express.Router();

// ROUTE
const authRoutes = require("./authRoutes");

// AUTH API ROUTES
router.use("/auth", authRoutes);


module.exports = router;
