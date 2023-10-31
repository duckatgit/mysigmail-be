const express = require("express");
const router = express.Router();

// ROUTE
const authRoutes = require("./authRoutes");
const signatureRoutes = require("./signatureRoutes");

// AUTH API ROUTES
router.use("/auth", authRoutes);
router.use("/signature", signatureRoutes);


module.exports = router;
