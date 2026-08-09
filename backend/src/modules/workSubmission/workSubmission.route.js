const express = require("express");
const protect = require(
 "../../middleware/authMiddleware"
);
const uploadWorkEvidence = require(
 "./workSubmission.upload"
);
const {
 submitCompletedWork,
 getWorkerAssignments,
 getOwnerPendingSubmissions,
 getSubmissionHistory,
 reviewCompletedWork
} = require(
 "./workSubmission.controller"
);
const router = express.Router();
router.get(
 "/worker/assignments",
 protect,
 getWorkerAssignments
);
router.get(
 "/owner/pending",
 protect,
 getOwnerPendingSubmissions
);
router.get(
 "/escrow/:escrowId/history",
 protect,
 getSubmissionHistory
);
router.post(
 "/escrow/:escrowId/submit",
 protect,
 uploadWorkEvidence.single("evidence"),
 submitCompletedWork
);
router.patch(
 "/:submissionId/review",
 protect,
 reviewCompletedWork
);
module.exports = router;
