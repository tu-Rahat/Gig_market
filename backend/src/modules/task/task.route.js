const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
    createTask,
    getTasks,
    getTaskById
} = require("./task.controller");

const router = express.Router();

// Marketplace read endpoints
router.get("/", getTasks);
router.get("/:id", getTaskById);

// Logged-in users can create task advertisements
router.post("/", protect, createTask);

module.exports = router;