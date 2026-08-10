const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
            index: true
        },
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: [1, "Bid amount must be greater than 0"]
        },
        message: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                1000,
                "Bid message cannot exceed 1000 characters"
            ]
        },
        status: {
            type: String,
            enum: [
                "active",
                "selected",
                "rejected",
                "withdrawn"
            ],
            default: "active",
            index: true
        }
    },
    {
        timestamps: true
    }
);

// One bid record per worker per task.
// The same record is updated when the worker lowers their bid.
bidSchema.index(
    {
        task: 1,
        bidder: 1
    },
    {
        unique: true
    }
);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;