const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
 getCountdown
} = require("./countdown.controller");
const router = express.Router();
router.get(
 "/:escrowId",
 protect,
 getCountdown
);
module.exports = router;