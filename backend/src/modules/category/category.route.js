const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require("./category.controller");

const router = express.Router();

// Public: used by task creation form and marketplace filters
router.get("/", getCategories);

// Protected management actions
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;