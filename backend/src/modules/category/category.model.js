const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            maxlength: [80, "Category name cannot exceed 80 characters"]
        },
        normalizedName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"]
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);
categorySchema.pre("validate", function () {
    if (this.name) {
        this.normalizedName = this.name.trim().toLowerCase();
    }
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;