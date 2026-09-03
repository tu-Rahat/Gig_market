const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
    getNearbyProviders
} = require("./provider.controller");

const router = express.Router();

router.get("/nearby", protect, getNearbyProviders);

module.exports = router;
