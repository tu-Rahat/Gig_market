const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
    createTask,
    getTasks,
    getTaskById,
    getMyTasks,
    updateTask,
    cancelTask
} = require("./task.controller");

const router = express.Router();

// Public marketplace tasks
router.get("/", getTasks);

// Logged-in owner's advertisements
// MUST stay before "/:id"
router.get("/mine", protect, getMyTasks);

// Create advertisement
router.post("/", protect, createTask);

// Edit advertisement
router.patch("/:id", protect, updateTask);

// Cancel advertisement
router.patch("/:id/cancel", protect, cancelTask);

// Single advertisement
router.get("/:id", getTaskById);

module.exports = router;