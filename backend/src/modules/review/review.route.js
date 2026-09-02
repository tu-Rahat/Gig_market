const express = require("express");
const {
  createReview,
  getProviderReviews
} = require("./review.controller");
const protect = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/tasks/:taskId", protect, createReview);
router.get("/providers/:userId", getProviderReviews);

module.exports = router;
