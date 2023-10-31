const express = require("express");
const router = express.Router();

// ROUTE
const authRoutes = require("./authRoutes");
const signatureRoutes = require("./signatureRoutes");
const uploadProjectRoutes = require("./uploadProjectRoutes");

// AUTH API ROUTES
router.use("/auth", authRoutes);
router.use("/signature", signatureRoutes);
router.use("/upload", uploadProjectRoutes);


module.exports = router;
