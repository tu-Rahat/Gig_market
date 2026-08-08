const Category = require("./category.model");
const Task = require("../task/task.model");

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .select("-normalizedName")
            .sort({ name: 1 });

        return res.status(200).json({
            count: categories.length,
            categories
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load categories",
            error: error.message
        });
    }
};

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, description = "" } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const normalizedName = name.trim().toLowerCase();
        const existingCategory = await Category.findOne({
            normalizedName
        });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description.trim(),
            createdBy: req.user.id
        });

        return res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }
        return res.status(500).json({
            message: "Failed to create category",
            error: error.message
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (category.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only manage categories you created"
            });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Category name cannot be empty"
                });
            }

            const normalizedName = name.trim().toLowerCase();
            const duplicate = await Category.findOne({
                normalizedName,
                _id: { $ne: category._id }
            });

            if (duplicate) {
                return res.status(400).json({
                    message: "Another category with this name already exists"
                });
            }

            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description.trim();
        }

        await category.save();

        return res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update category",
            error: error.message
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (category.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only manage categories you created"
            });
        }

        const taskUsingCategory = await Task.exists({
            category: category._id
        });

        if (taskUsingCategory) {
            return res.status(400).json({
                message: "Cannot delete this category because a task is using it"
            });
        }

        await category.deleteOne();

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete category",
            error: error.message
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};