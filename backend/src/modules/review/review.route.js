const express = require("express");
const {
  createReview,
  getProviderReviews,
  getMyReviewableTasks
} = require("./review.controller");
const protect = require("../../middleware/authMiddleware");

const router = express.Router();
router.get(
    "/mine/reviewable",
    protect,
    getMyReviewableTasks
);
router.post("/tasks/:taskId", protect, createReview);
router.get("/providers/:userId", getProviderReviews);

module.exports = router;
