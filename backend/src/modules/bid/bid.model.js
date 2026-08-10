const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "withdrawn", "accepted", "rejected"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
