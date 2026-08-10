const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
    submitOrLowerBid,
    getBidSummary,
    getOwnerTaskBids
} = require("./bid.controller");

const router = express.Router();

// Worker submits or lowers their bid
router.post("/task/:taskId", protect, submitOrLowerBid);

// Worker sees basic reverse-auction summary
router.get("/task/:taskId/summary", protect, getBidSummary);

// Owner sees active bids for their own task.
// Useful foundation for Feature 7.
router.get("/task/:taskId/owner", protect, getOwnerTaskBids);

module.exports = router;