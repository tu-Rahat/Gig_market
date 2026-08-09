const mongoose = require("mongoose");
const escrowSchema = new mongoose.Schema(
 {
 task: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "Task",
 required: true,
 index: true
 },
 owner: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
 required: true,
 index: true
 },
 worker: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
 required: true,
 index: true
 },
 amount: {
 type: Number,
 required: true,
 min: [0, "Escrow amount cannot be negative"]
 },
 currency: {
 type: String,
 default: "BDT",
 enum: ["BDT"]
 },
 status: {
 type: String,
 enum: [
 "held",
 "released",
 "refunded",
 "disputed"
 ],
 default: "held",
 index: true
 },
 paymentReference: {
 type: String,
 required: true,
 unique: true
 },
 heldAt: {
 type: Date,
 default: Date.now
 },
 completionDeadline: {
 type: Date,
 required: true
 },
 releasedAt: {
 type: Date,
 default: null
 },
 refundedAt: {
 type: Date,
 default: null
 }
 },
 {
 timestamps: true
 }
);
escrowSchema.index(
 { task: 1, status: 1 },
 { unique: false }
);
const Escrow = mongoose.model("Escrow", escrowSchema);
module.exports = Escrow;