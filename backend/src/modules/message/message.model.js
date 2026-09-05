const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
            index: true
        },
        bid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bid",
            required: true,
            index: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },
        integrityTag: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

messageSchema.index({ task: 1, bid: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
