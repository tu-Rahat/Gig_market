const Task = require("./task.model");
const Category = require("../category/category.model");

// Create a new task advertisement
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            duration,
            budgetMin,
            budgetMax
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !location ||
            !duration ||
            budgetMin === undefined ||
            budgetMax === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all required task fields"
            });
        }

        const minBudget = Number(budgetMin);
        const maxBudget = Number(budgetMax);

        if (
            Number.isNaN(minBudget) ||
            Number.isNaN(maxBudget) ||
            minBudget < 0 ||
            maxBudget < 0
        ) {
            return res.status(400).json({
                message: "Budget values must be valid non-negative numbers"
            });
        }

        if (minBudget > maxBudget) {
            return res.status(400).json({
                message: "Maximum budget must be greater than or equal to minimum budget"
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                message: "Selected category does not exist"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description.trim(),
            category,
            location: location.trim(),
            duration: duration.trim(),
            budgetMin: minBudget,
            budgetMax: maxBudget,
            createdBy: req.user.id
        });

        await task.populate("category", "name");
        await task.populate("createdBy", "name email");

        return res.status(201).json({
            message: "Task advertisement created successfully",
            task
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create task advertisement",
            error: error.message
        });
    }
};

// Supporting read endpoint: list open task advertisements
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ status: "open" })
            .populate("category", "name")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: tasks.length,
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load tasks",
            error: error.message
        });
    }
};

// Supporting read endpoint: single task advertisement
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("category", "name")
            .populate("createdBy", "name");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            task
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load task",
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById
};