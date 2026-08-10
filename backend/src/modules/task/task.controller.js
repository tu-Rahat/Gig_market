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
// Feature 3: list advertisements created by logged-in owner
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            createdBy: req.user.id
        })
        .populate("category", "name")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            count: tasks.length,
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load your advertisements",
            error: error.message
        });
    }
};

// Feature 3: edit an advertisement while it is still open
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (
            task.createdBy.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Only the task owner can edit this advertisement"
            });
        }

        if (task.status !== "open") {
            return res.status(400).json({
                message: "Only open advertisements can be edited"
            });
        }

        const {
            title,
            description,
            category,
            location,
            duration,
            budgetMin,
            budgetMax
        } = req.body;

        if (category !== undefined) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    message: "Selected category does not exist"
                });
            }
            task.category = category;
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    message: "Task title cannot be empty"
                });
            }
            task.title = title.trim();
        }

        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(400).json({
                    message: "Task description cannot be empty"
                });
            }
            task.description = description.trim();
        }

        if (location !== undefined) {
            if (!location.trim()) {
                return res.status(400).json({
                    message: "Location cannot be empty"
                });
            }
            task.location = location.trim();
        }

        if (duration !== undefined) {
            if (!duration.trim()) {
                return res.status(400).json({
                    message: "Duration cannot be empty"
                });
            }
            task.duration = duration.trim();
        }

        const nextBudgetMin = budgetMin !== undefined
            ? Number(budgetMin)
            : task.budgetMin;

        const nextBudgetMax = budgetMax !== undefined
            ? Number(budgetMax)
            : task.budgetMax;

        if (
            Number.isNaN(nextBudgetMin) ||
            Number.isNaN(nextBudgetMax) ||
            nextBudgetMin < 0 ||
            nextBudgetMax < 0
        ) {
            return res.status(400).json({
                message: "Budget values must be valid non-negative numbers"
            });
        }

        if (nextBudgetMin > nextBudgetMax) {
            return res.status(400).json({
                message: "Maximum budget must be greater than or equal to minimum budget"
            });
        }

        task.budgetMin = nextBudgetMin;
        task.budgetMax = nextBudgetMax;

        await task.save();
        await task.populate(
            "category",
            "name"
        );

        return res.status(200).json({
            message: "Advertisement updated successfully",
            task
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update advertisement",
            error: error.message
        });
    }
};

// Feature 3: cancel before a worker is selected
const cancelTask = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (
            task.createdBy.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Only the task owner can cancel this advertisement"
            });
        }

        if (task.status !== "open") {
            return res.status(400).json({
                message: "Only open advertisements can be cancelled"
            });
        }

        task.status = "cancelled";
        await task.save();

        return res.status(200).json({
            message: "Advertisement cancelled successfully",
            task
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to cancel advertisement",
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    getMyTasks,
    updateTask,
    cancelTask
};