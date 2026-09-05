const express = require("express");
const protect = require("../../middleware/authMiddleware");
const { sendMessage, listMessages } = require("./message.controller");

const router = express.Router();

router.get("/task/:taskId/bid/:bidId", protect, listMessages);
router.post("/task/:taskId/bid/:bidId", protect, sendMessage);

module.exports = router;
