const express = require("express");

const protect = require("../../middleware/authMiddleware");

const {
    getTransactionHistory
} = require("./transaction.controller");


const router = express.Router();


// Feature 21
// Get transaction history
router.get(
    "/history",
    protect,
    getTransactionHistory
);


module.exports = router;