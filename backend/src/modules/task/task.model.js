const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [120, "Title cannot exceed 120 characters"]
        },
        description: {
            type: String,
            required: [true, "Task description is required"],
            trim: true,
            maxlength: [3000, "Description cannot exceed 3000 characters"]
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"]
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
            maxlength: [200, "Location cannot exceed 200 characters"]
        },
        duration: {
            type: String,
            required: [true, "Duration is required"],
            trim: true,
            maxlength: [100, "Duration cannot exceed 100 characters"]
        },
        budgetMin: {
            type: Number,
            required: [true, "Minimum budget is required"],
            min: [0, "Minimum budget cannot be negative"]
        },
        budgetMax: {
            type: Number,
            required: [true, "Maximum budget is required"],
            min: [0, "Maximum budget cannot be negative"]
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["open", "in_progress", "completed", "cancelled"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

taskSchema.pre("validate", function (next) {
    if (
        this.budgetMin !== undefined &&
        this.budgetMax !== undefined &&
        this.budgetMin > this.budgetMax
    ) {
        this.invalidate(
            "budgetMax",
            "Maximum budget must be greater than or equal to minimum budget"
        );
    }
    next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;