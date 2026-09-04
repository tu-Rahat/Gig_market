const fs = require("fs");
const WorkSubmission = require(
 "./workSubmission.model"
);
const Escrow = require(
 "../escrow/escrow.model"
);
const Task = require(
 "../task/task.model"
);
const {
    encryptText,
    decryptText
} = require(
    "../../crypto/ecc/ecc.application"
);

const {
    configureDevelopmentECCProvider
} = require(
    "../../crypto/ecc/ecc.keyProvider"
);
const removeUploadedFile = (file) => {
 if (!file?.path) {
 return;
 }
 fs.unlink(file.path, () => {});
};
const buildEvidence = (file) => {
 if (!file) {
 return {
 originalName: "",
 storedName: "",
 mimeType: "",
 filePath: "",
 fileSize: 0
 };
 }
 return {
 originalName: file.originalname,
 storedName: file.filename,
 mimeType: file.mimetype,
 filePath: file.path,
 fileSize: file.size
 };
};
const decryptCompletionNote = async (
    completionNote
) => {
    // Existing submissions created before
    // ECC integration are stored as plaintext.
    if (
        typeof completionNote === "string"
    ) {
        return completionNote;
    }

    if (!completionNote) {
        return completionNote;
    }

    const keyId =
        configureDevelopmentECCProvider();

    return await decryptText(
        completionNote,
        keyId
    );
};
// Feature 17: worker submits completed work
const submitCompletedWork = async (req, res) => {
 try {
 const { escrowId } = req.params;
 const { completionNote } = req.body;
 if (!completionNote || !completionNote.trim()) {
 removeUploadedFile(req.file);
 return res.status(400).json({
 message: "Completion note is required"
 });
 }
 const trimmedCompletionNote =
    completionNote.trim();

if (trimmedCompletionNote.length > 3000) {
    removeUploadedFile(req.file);

    return res.status(400).json({
        message:
            "Completion note cannot exceed 3000 characters"
    });
}
 const escrow = await Escrow.findById(
 escrowId
 );
 if (!escrow) {
 removeUploadedFile(req.file);
 return res.status(404).json({
 message: "Escrow record not found"
 });
 }
 if (
 escrow.worker.toString() !== req.user.id
 ) {
 removeUploadedFile(req.file);
 return res.status(403).json({
 message: "Only the selected worker can submit completed work"
 });
 }
 if (escrow.status !== "held") {
 removeUploadedFile(req.file);
 return res.status(400).json({
 message:
 "Completed work can only be submitted while escrow is held"
 });
 }
 const pendingSubmission =
 await WorkSubmission.findOne({
 escrow: escrow._id,
 status: "submitted"
 });
 if (pendingSubmission) {
 removeUploadedFile(req.file);
 return res.status(400).json({
 message:
 "A completion submission is already waiting for owner review"
 });
 }
 const approvedSubmission =
 await WorkSubmission.findOne({
 escrow: escrow._id,
 status: "approved"
 });
 if (approvedSubmission) {
 removeUploadedFile(req.file);
 return res.status(400).json({
 message:
 "This task completion has already been approved"
 });
 }
 const keyId =
    configureDevelopmentECCProvider();

const encryptedCompletionNote =
    await encryptText(
        trimmedCompletionNote,
        keyId
    );
 const submission =
 await WorkSubmission.create({
 escrow: escrow._id,
 task: escrow.task,
 owner: escrow.owner,
 worker: escrow.worker,
 completionNote:
 completionNote.trim(),
 evidence: buildEvidence(req.file)
 });
 await submission.populate(
 "task",
 "title status"
 );
 await submission.populate(
 "owner",
 "name email"
 );
 await submission.populate(
 "worker",
 "name email"
 );
 return res.status(201).json({
 message:
 "Completed work submitted successfully",
 submission
 });
 } catch (error) {
 removeUploadedFile(req.file);
 return res.status(500).json({
 message:
    "Failed to submit completed work",
error: error.message
 });
 }
};

// Worker: list assignments available for completion
const getWorkerAssignments = async (req, res) => {
 try {
 const escrows = await Escrow.find({
 worker: req.user.id,
 status: "held"
 })
 .populate(
 "task",
 "title status location duration"
 )
 .populate(
 "owner",
 "name"
 )
 .sort({
 completionDeadline: 1
 });
 const items = await Promise.all(
 escrows.map(async (escrow) => {
 const latestSubmission =
 await WorkSubmission.findOne({
 escrow: escrow._id
 })
 .sort({
 createdAt: -1
 })
 .select(
 "status submittedAt reviewedAt rejectionReason"
 );
 return {
 escrow,
 latestSubmission
 };
 })
 );
 return res.status(200).json({
 count: items.length,
 assignments: items
 });
 } catch (error) {
 return res.status(500).json({
 message:
 "Failed to load worker assignments",
 error: error.message
 });
 }
};
// Owner: list submitted work waiting for review
const getOwnerPendingSubmissions = async (
 req,
 res
) => {
 try {
 const submissions =
 await WorkSubmission.find({
 owner: req.user.id,
 status: "submitted"
 })
 .populate(
 "task",
 "title status location"
 )
 .populate(
 "worker",
 "name email"
 )
 .populate(
 "escrow",
 "amount currency status completionDeadline paymentReference"
 ).sort({
 submittedAt: -1
 });
 return res.status(200).json({
 count: submissions.length,
 submissions
 });
 } catch (error) {
 return res.status(500).json({
 message:
 "Failed to load pending submissions",
 error: error.message
 });
 }
};
// Owner or worker: submission history for one escrow
const getSubmissionHistory = async (
 req,
 res
) => {
 try {
 const escrow = await Escrow.findById(
 req.params.escrowId
 );
 if (!escrow) {
 return res.status(404).json({
 message: "Escrow record not found"
 });
 }
 const userId = req.user.id;
 if (
 escrow.owner.toString() !== userId &&
 escrow.worker.toString() !== userId
 ) {
 return res.status(403).json({
 message:
 "You do not have access to this work history"
 });
 }
 const submissions =
 await WorkSubmission.find({
 escrow: escrow._id
 })
 .populate(
 "worker",
 "name"
 )
 .sort({
 createdAt: -1
 });
 return res.status(200).json({
 count: submissions.length,
 submissions
 });
 } catch (error) {
 return res.status(500).json({
 message:
 "Failed to load submission history",
 error: error.message
 });
 }
};


// Feature 18: owner approves or rejects completed work
const reviewCompletedWork = async (req, res) => {
 try {
 const {
 decision,
 rejectionReason = ""
 } = req.body;
 if (
 decision !== "approve" &&
 decision !== "reject"
 ) {
 return res.status(400).json({
 message:
 "Decision must be approve or reject"
 });
 }
 if (
 decision === "reject" &&
 !rejectionReason.trim()
 ) {
 return res.status(400).json({
 message:
 "Rejection reason is required when rejecting work"
 });
 }
 const submission =
 await WorkSubmission.findById(
 req.params.submissionId
 );
 if (!submission) {
 return res.status(404).json({
 message:
 "Work submission not found"
 });
 }
 if (
 submission.owner.toString() !==
 req.user.id
 ) {
 return res.status(403).json({
 message:
 "Only the task owner can review this submission"
 });
 }
 if (submission.status !== "submitted") {
 return res.status(400).json({
 message:
 "This submission has already been reviewed"
 });
 }
 const escrow = await Escrow.findById(
 submission.escrow
 );
 if (!escrow) {
 return res.status(404).json({
 message:
 "Associated escrow record not found"
 });
 }
 if (escrow.status !== "held") {
 return res.status(400).json({
 message:
 "Work can only be reviewed while escrow is held"
 });
 }
if (decision === "approve") {

    submission.status = "approved";

    submission.rejectionReason = "";

    submission.reviewedAt = new Date();

    await submission.save();

    const task = await Task.findById(
        submission.task
    );

    if (task) {

        task.status = "completed";

        await task.save();

    }

    const completedAt =
        new Date();

    const approvalDeadline =
        new Date(
            completedAt.getTime() +
            24 * 60 * 60 * 1000
        );

    escrow.approvalDeadline =
        approvalDeadline;

    await escrow.save();

    return res.status(200).json({

        message:
            "Completed work approved successfully",

        submission,

        paymentStatus:
            "Escrow remains held until payment release logic runs",

        approvalDeadline

    });
}
 submission.status = "rejected";
 submission.rejectionReason =
 rejectionReason.trim();
 submission.reviewedAt = new Date();
 await submission.save();
 return res.status(200).json({
 message:
 "Completed work rejected. Worker may submit again.",
 submission
 });
 } catch (error) {
 return res.status(500).json({
 message:
 "Failed to review completed work",
 error: error.message
 });
 }
};
module.exports = {
 submitCompletedWork,
 getWorkerAssignments,
 getOwnerPendingSubmissions,
 getSubmissionHistory,
 reviewCompletedWork
};
