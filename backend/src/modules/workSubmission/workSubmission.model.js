const mongoose = require("mongoose");
const workSubmissionSchema = new mongoose.Schema(
 {
 escrow: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "Escrow",
 required: true,
 index: true
 },
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
 completionNote: {
 type: String,
 required: [true, "Completion note is required"],
 trim: true,
 maxlength: [
 3000,
 "Completion note cannot exceed 3000 characters"
 ]
 },
 evidence: {
 originalName: {
 type: String,
 default: ""
 },
 storedName: {
 type: String,
 default: ""
 },
 mimeType: {
 type: String,
 default: ""
 },
 filePath: {
 type: String,
 default: ""
 },
 fileSize: {
 type: Number,
 default: 0
 }
 },
 status: {
 type: String,
 enum: [
 "submitted",
 "approved",
 "rejected"
 ],
 default: "submitted",
 index: true
 },
 submittedAt: {
 type: Date,
 default: Date.now
 },
 reviewedAt: {
 type: Date,
 default: null
 },
 rejectionReason: {
 type: String,
 default: "",
 trim: true,
 maxlength: [
 1000,
 "Rejection reason cannot exceed 1000 characters"
 ]
 }
 },
 {
 timestamps: true
 }
);
const WorkSubmission = mongoose.model(
 "WorkSubmission",
 workSubmissionSchema
);
module.exports = WorkSubmission;