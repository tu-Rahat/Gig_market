const express = require("express");
const protect = require(
  "../../middleware/authMiddleware"
);
const {
  filterTaskBidders
} = require(
  "./bidderFilter.controller"
);

const router = express.Router();

router.get(
  "/task/:taskId",
  protect,
  filterTaskBidders
);

module.exports = router;